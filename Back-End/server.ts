import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "./src/database/Connection.js";
import UserRoute from "./src/routes/UserRoute.js";
import PostRoute from "./src/routes/PostRoute.js";
import GroupRoute from "./src/routes/GroupRoute.js";
import MessageRoute from "./src/routes/MessageRoute.js";
import { sendMessage } from "./src/services/message/sendMessage.js";
import { query } from "./src/database/Connection.js";
import orgRoute from "./src/routes/orgRoute.js";
import listingRoute from "./src/routes/listingRoute.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const PORT = process.env.PORT || 5000;
const userSockets = new Map<string, string>();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/org", orgRoute);
app.use("/listing", listingRoute);
app.use("/message", MessageRoute);
app.use("/group", GroupRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "NavSumaro Backend - localhost running!" });
});

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

io.on("connection", (socket) => {
  socket.on("user_connected", async (userId: string) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);

    try {
      await query(`UPDATE users SET "isOnline" = true WHERE id = $1`, [userId]);
    } catch (err) {
      console.error("Failed to set user online:", err);
    }

    io.emit("user_status_change", { userId, isOnline: true });
  });

  socket.on("join_conversation", (threadId) => {
    socket.join(threadId);
  });

  socket.on("send_message", async (data) => {
    try {
      const existsQuery = `
      SELECT id FROM threads
      WHERE ("participantOneId" = LEAST($1::uuid, $2::uuid) AND "participantTwoId" = GREATEST($1::uuid, $2::uuid))
      OR ("orgParticipantOneId" = $1::uuid AND "participantTwoId" = $2::uuid)
      OR ("participantOneId" = $1::uuid AND "orgParticipantTwoId" = $2::uuid)
      OR ("orgParticipantOneId" = $1::uuid AND "orgParticipantTwoId" = $2::uuid)
    `;
      const existsResult = await query(existsQuery, [
        data.senderId,
        data.recipientId,
      ]);
      const threadExists = existsResult.rows.length > 0;

      const result = await sendMessage(
        {
          text: data.text,
          recipientId: data.recipientId,
          recipientIsOrg: data.recipientIsOrg ?? false,
        },
        {
          id: data.senderId,
          accountType: data.senderAccountType ?? "student",
        },
      );

      if (result.success) {
        const realThreadId = result.data.threadId;
        const messagePayload = { ...result.data, threadId: realThreadId };

        if (!threadExists) {
          try {
            const senderQuery =
              data.senderAccountType === "organization"
                ? `SELECT id, name AS firstname, '' AS lastname, avatar, "organizationType" AS program, false AS "isOnline" FROM organizations WHERE id = $1`
                : `SELECT id, firstname, lastname, avatar, program, "isOnline" FROM users WHERE id = $1`;
            const senderResult = await query(senderQuery, [data.senderId]);
            const sender = senderResult.rows[0];
            const recipientSocketId = userSockets.get(data.recipientId);

            if (recipientSocketId) {
              io.to(recipientSocketId).emit("new_thread", {
                id: realThreadId,
                participantId: sender.id,
                firstname: sender.firstname,
                lastname: sender.lastname,
                avatar: sender.avatar,
                program: sender.program,
                isOnline: sender.isOnline,
                accountType: data.senderAccountType ?? "student",
                lastMessage: data.text,
                createdAt: new Date(),
                unread: 1,
              });
            }
          } catch (err) {
            console.error("Error fetching sender info:", err);
          }
        }

        socket.join(realThreadId);
        const recipientSocketId = userSockets.get(data.recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive_message", messagePayload);
        }
        socket.emit("receive_message", messagePayload);
        io.emit("thread_updated", {
          threadId: realThreadId,
          lastMessage: data.text,
          senderId: data.senderId,
          recipientId: data.recipientId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", async () => {
    let disconnectedUserId: string | null = null;

    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        userSockets.delete(userId);
        break;
      }
    }

    console.log("User disconnected:", socket.id);

    if (disconnectedUserId) {
      try {
        await query(`UPDATE users SET "isOnline" = false WHERE id = $1`, [
          disconnectedUserId,
        ]);
      } catch (err) {
        console.error("Failed to set user offline:", err);
      }

      io.emit("user_status_change", {
        userId: disconnectedUserId,
        isOnline: false,
      });
    }
  });

  socket.on("send_group_message", async (data) => {
    try {
      const { groupId, text, senderId } = data;

      const senderResult = await query(
        `SELECT firstname, lastname, avatar FROM users WHERE id = $1`,
        [senderId],
      );
      const sender = senderResult.rows[0];

      const membersResult = await query(
        `SELECT user_id FROM group_members WHERE group_id = $1`,
        [groupId],
      );
      const members = membersResult.rows.map((row) => row.user_id);

      socket.join(groupId);

      const messagePayload = {
        id: data.id,
        groupId,
        senderId,
        text,
        firstname: sender?.firstname,
        lastname: sender?.lastname,
        senderAvatar: sender?.avatar || senderId?.[0] || "?",
        createdAt: data.createdAt,
        seenBy: [],
      };

      members.forEach((memberId) => {
        const memberSocketId = userSockets.get(memberId);
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive_group_message", messagePayload);
        }
      });

      socket.emit("receive_group_message", messagePayload);
    } catch (error) {
      console.error("Error sending group message:", error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
