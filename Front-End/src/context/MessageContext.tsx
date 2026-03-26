import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Message, GroupConversation, GroupMessage } from "../types";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "./CurrentUserContex";

export type ChatSession = Message | GroupConversation;

interface MessageContextType {
  Messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  groupConversations: GroupConversation[];
  setGroupConversations: React.Dispatch<React.SetStateAction<GroupConversation[]>>;
  selectedMessage: ChatSession | null;
  setSelectedMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  showCreateMessage: boolean;
  setShowCreateMessage: React.Dispatch<React.SetStateAction<boolean>>;
  selectedConversation: ChatSession | null;
  setSelectedConversation: (conv: ChatSession | null) => void;
  sendGroupMessage: (groupId: string, newMessage: GroupMessage) => void;
  socket: Socket;
  threads: any[];
  setThreads: React.Dispatch<React.SetStateAction<any[]>>;
  totalUnread: number;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [Messages, setMessages] = useState<Message[]>([]);
  const [groupConversations, setGroupConversations] = useState<GroupConversation[]>([]);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ChatSession | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const socket = useMemo(() => io(apiUrl), [apiUrl]);
  
  const { currentUser } = useCurrentUser();
  const currentUserRef = useRef(currentUser);
  const selectedConversationRef = useRef(selectedConversation);

  useEffect(() => {
    if (currentUser?.id) {
      socket.emit("user_connected", currentUser.id);
    }
  }, [currentUser?.id, socket]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  const fetchThreads = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/message/threads`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setThreads(data.data ?? []);
        setMessages(data.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchThreads();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const handleStatusChange = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.participantId === userId ? { ...t, isOnline } : t
        )
      );
      setSelectedConversation((prev: any) => {
        if (!prev) return prev;
        const participantId = prev.participantId ?? prev.participant?.id;
        if (participantId === userId) {
          return {
            ...prev,
            isOnline,
            participant: prev.participant
              ? { ...prev.participant, isOnline }
              : prev.participant,
          };
        }
        return prev;
      });
    };

    socket.on("user_status_change", handleStatusChange);
    return () => {socket.off("user_status_change", handleStatusChange)};
  }, [socket]);

  useEffect(() => {
    const handleNewThread = (threadData: any) => {
      setThreads((prev) => {
        if (prev.some((t) => t.id === threadData.id)) return prev;
        return [threadData, ...prev];
      });
    };
    socket.on("new_thread", handleNewThread);
    return () => {socket.off("new_thread", handleNewThread)};
  }, [socket]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: any) => {
      const isMine = newMessage.senderId === currentUserRef.current?.id;
      const isCurrentlyOpen =
        (selectedConversationRef.current as any)?.id === newMessage.threadId;

      setThreads((prev) => {
        const threadExists = prev.some((t) => t.id === newMessage.threadId);
        if (!threadExists) {
          fetchThreads();
          setTimeout(() => fetchThreads(), 500);
          return prev;
        }
        return prev.map((t) =>
          t.id === newMessage.threadId
            ? {
                ...t,
                lastMessage: newMessage.text,
                unread: isMine || isCurrentlyOpen ? t.unread : (t.unread ?? 0) + 1,
              }
            : t,
        );
      });
    };

    const handleThreadUpdated = (payload: any) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === payload.threadId
            ? { ...t, lastMessage: payload.lastMessage }
            : t,
        ),
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("thread_updated", handleThreadUpdated);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("thread_updated", handleThreadUpdated);
    };
  }, [socket]);

  const sendGroupMessage = (groupId: string, newMessage: GroupMessage) => {
    setGroupConversations((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, messages: [...group.messages, newMessage] }
          : group,
      ),
    );
  };

  const totalUnread = threads.reduce((sum, t) => sum + (t.unread ?? 0), 0);

  const selectedMessage =
    Messages.find((p) => p.id === selectedMessageId) ||
    groupConversations.find((g) => g.id === selectedMessageId) ||
    null;

  return (
    <MessageContext.Provider
      value={{
        totalUnread,
        threads,
        setThreads,
        Messages,
        setMessages,
        groupConversations,
        setGroupConversations,
        selectedMessage,
        setSelectedMessageId,
        showCreateMessage,
        setShowCreateMessage,
        setSelectedConversation,
        selectedConversation,
        sendGroupMessage,
        socket,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessages must be used inside MessageProvider");
  return context;
};