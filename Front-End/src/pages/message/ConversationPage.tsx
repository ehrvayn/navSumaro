import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../../components/ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { useMessages } from "../../context/MessageContext";
import DeleteConversationModal from "../../components/modals/DeleteConversationModal";
import { usePage } from "../../context/PageContex";
import { usePosts } from "../../context/PostContext";
import {
  SendHorizontal,
  ArrowLeft,
  EllipsisVertical,
  Trash2,
  User,
} from "lucide-react";

interface ConversationPageProps {
  conversation: any;
  onBack: () => void;
  isGroup?: boolean;
}

const ConversationPage: React.FC<ConversationPageProps> = ({
  conversation,
  onBack,
  isGroup = false,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setLocalMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [showDeleteConvoModal, setShowDeletConvoModal] = useState(false);
  const lastChat = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadIdRef = useRef<string>(conversation.id);
  const { currentUser } = useCurrentUser();
  const { socket, setThreads } = useMessages();
  const { setActivePage } = usePage();
  const { getUserData, setPostUserProfileId } = usePosts();
  const participant = conversation.participant || conversation;
  const isOrgParticipant = participant?.accountType === "organization";
  const isOnline = !isGroup && (participant?.isOnline || conversation.isOnline);

  const headerName = isGroup
    ? conversation.title
    : isOrgParticipant
      ? participant?.firstname || "User"
      : `${participant?.firstname || "User"} ${participant?.lastname || ""}`;

  const getInitials = () => {
    if (isOrgParticipant) {
      return participant?.firstname?.[0] ?? "";
    }
    return (
      (participant?.firstname?.[0] ?? "") + (participant?.lastname?.[0] ?? "")
    );
  };

  const isTempId = (id: string) =>
    id.startsWith("new-") || id.startsWith("conv-");

  useEffect(() => {
    socket.emit("join_conversation", threadIdRef.current);

    const handleThreadAssigned = ({
      tempId,
      realId,
    }: {
      tempId: string;
      realId: string;
    }) => {
      if (threadIdRef.current === tempId) {
        threadIdRef.current = realId;
        socket.emit("join_conversation", realId);
      }
    };

    socket.on("thread_id_assigned", handleThreadAssigned);

    return () => {
      socket.off("thread_id_assigned", handleThreadAssigned);
    };
  }, [socket]);

  useEffect(() => {
    const handleMessage = (newMessage: any) => {
      if (
        isTempId(threadIdRef.current) &&
        newMessage.threadId &&
        !isTempId(newMessage.threadId)
      ) {
        threadIdRef.current = newMessage.threadId;
      }
      setLocalMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!conversation.id || isTempId(conversation.id)) return;

    setThreads((prev) =>
      prev.map((t) => (t.id === conversation.id ? { ...t, unread: 0 } : t)),
    );

    const markRead = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await fetch(
          `http://localhost:5000/message/threads/read/${conversation.id}`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (error) {
        console.error(error);
      }
    };

    markRead();
  }, [conversation.id]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    lastChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversation.id || isTempId(conversation.id)) {
      setLoading(false);
      return;
    }
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(
          "http://localhost:5000/message/retrieveAll",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ threadId: conversation.id }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          setLocalMessages(data.data ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversation.id]);

  const submitMessage = () => {
    if (!message.trim() || !currentUser) return;
    socket.emit("send_message", {
      threadId: threadIdRef.current,
      text: message,
      senderId: currentUser.id,
      recipientId: conversation.participantId || conversation.participant?.id,
    });
    setMessage("");
  };

  const handleDeleteConvo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/message/threads/delete/${conversation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        setThreads((prev) => prev.filter((t) => t.id !== conversation.id));
        onBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
      <div className="bg-base-surface border-b border-border px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative inline-flex">
            <Avatar initials={getInitials()} size="xs" />
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-base-surface" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-text-primary truncate block">
              {headerName}
            </span>
            <div
              className={`text-[10px] font-medium ${isOnline ? "text-green-400" : "text-text-muted"}`}
            >
              {isOnline ? "Online" : ""}
            </div>
          </div>
        </div>

        <div className="relative">
          <EllipsisVertical
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(!openMenu);
            }}
            className="cursor-pointer text-text-muted hover:text-text-primary"
            size={20}
          />
          {openMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-60 bg-base-surface border border-border rounded-md shadow-lg z-50"
            >
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-gray-700"
                onClick={() => {
                  setPostUserProfileId(
                    conversation.participantId || conversation.participant?.id,
                  );
                  getUserData(
                    conversation.participantId || conversation.participant?.id,
                  );
                  onBack();
                  setOpenMenu(!openMenu);
                  setActivePage("profile");
                }}
              >
                <User size={20} />
                View Profile
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-700"
                onClick={() => setShowDeletConvoModal(true)}
              >
                <Trash2 size={20} />
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-base p-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-center text-text-muted text-xs py-8">
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-text-muted text-xs py-8">
            No messages yet
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex gap-2 items-end ${isMe ? "flex-row-reverse" : ""}`}
              >
                {!isMe && <Avatar initials={getInitials()} size="xs" />}
                <div
                  className={`px-3 py-2 text-xs rounded-2xl max-w-[70%] ${isMe ? "bg-orange-600 text-white rounded-br-none" : "bg-white/[0.05] border border-white/10 text-slate-200 rounded-bl-none"}`}
                >
                  <p
                    className={`text-xs leading-relaxed ${isMe ? "text-white" : "text-text-primary"}`}
                  >
                    {m.text}
                  </p>
                  <span
                    className={`text-[9px] mt-0.5 block ${isMe ? "text-orange-200 text-right" : "text-text-muted"}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={lastChat} />
      </div>

      <div className="bg-base-surface border-t border-border p-3 flex items-center shrink-0">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitMessage()}
            placeholder="Write a message..."
            className="w-full bg-base border border-border rounded-2xl pl-3 pr-9 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors"
          />
          <button
            onClick={submitMessage}
            disabled={!message.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand disabled:text-text-muted"
          >
            <SendHorizontal size={15} />
          </button>
        </div>
      </div>

      {showDeleteConvoModal && (
        <DeleteConversationModal
          handleDeleteConvo={handleDeleteConvo}
          onClose={() => setShowDeletConvoModal(false)}
        />
      )}
    </div>
  );
};

export default ConversationPage;
