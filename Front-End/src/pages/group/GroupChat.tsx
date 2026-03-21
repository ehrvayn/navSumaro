import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../../components/ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { useMessages } from "../../context/MessageContext";
import { SendHorizontal } from "lucide-react";
import { GroupConversation, GroupMessage } from "../../types";

interface GroupChatProps {
  conversation: GroupConversation;
}

const GroupChat: React.FC<GroupChatProps> = ({ conversation }) => {
  const [message, setMessage] = useState("");
  const [messages, setLocalMessages] = useState<GroupMessage[]>([]);
  const { currentUser } = useCurrentUser();
  const { socket } = useMessages();
  const lastChat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation.messages && Array.isArray(conversation.messages)) {
      const converted = conversation.messages.map((msg: any) => {
        return {
          id: msg.id,
          senderId: msg.senderId,
          firstname: msg.firstname || "Unknown",
          lastname: msg.lastname || "Unknown",
          senderAvatar:
            msg.senderAvatar || msg.avatar || msg.senderId?.[0] || "?",
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          seenBy: msg.seenBy || [],
        };
      });
      setLocalMessages(converted);
    } else {
    }
  }, [conversation.messages]);

  useEffect(() => {
    lastChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !currentUser) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/group/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: conversation.id,
          text: message,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        socket.emit("send_group_message", {
          groupId: conversation.id,
          ...result.data,
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col md:h-full h-[calc(100%-60px)] bg-base overflow-hidden overscroll-none touch-none">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 overscroll-contain touch-pan-y">
        {messages.length === 0 ? (
          <div className="text-center text-text-muted text-xs py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id;
            const showName =
              index === 0 || messages[index - 1].senderId !== msg.senderId;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMe && (
                  <Avatar
                    initials={`${msg.firstname?.[0] || ""}${msg.lastname?.[0] || ""}`}
                    size="xs"
                  />
                )}
                <div
                  className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}
                >
                  {showName && !isMe && (
                    <span className="text-[10px] text-slate-500 mb-1 ml-1">
                      {msg.firstname}
                    </span>
                  )}
                  <div
                    className={`px-3 py-2 text-xs rounded-2xl ${
                      isMe
                        ? "bg-orange-600 text-white rounded-br-none"
                        : "bg-white/[0.05] border border-white/10 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-600 mt-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={lastChat} />
      </div>

      <div className="p-3 border-t border-white/[0.08] shrink-0 bg-base">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            onFocus={() => window.scrollTo(0, 0)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent py-2 text-xs text-slate-200 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="text-orange-500 disabled:opacity-30"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
