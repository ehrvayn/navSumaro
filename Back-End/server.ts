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
  console.log("User connected:", socket.id);

  socket.on("user_connected", (userId: string) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("join_conversation", (threadId) => {
    socket.join(threadId);
  });

  socket.on("send_message", async (data) => {
    try {
      const existsQuery = `
        SELECT id FROM threads
        WHERE "participantOneId" = LEAST($1::uuid, $2::uuid)
        AND "participantTwoId" = GREATEST($1::uuid, $2::uuid)
      `;
      const existsResult = await query(existsQuery, [
        data.senderId,
        data.recipientId,
      ]);
      const threadExists = existsResult.rows.length > 0;

      const result = await sendMessage(
        { text: data.text, recipientId: data.recipientId },
        { id: data.senderId },
      );

      if (result.success) {
        const realThreadId = result.data.threadId;
        const messagePayload = { ...result.data, threadId: realThreadId };

        if (!threadExists) {
          try {
            const senderQuery = `SELECT id, firstname, lastname, avatar, program, "isOnline" FROM users WHERE id = $1`;
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

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 