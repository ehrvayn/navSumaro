import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Group, GroupMember, JoinRequest } from "../types";
import { useCurrentUser } from "./CurrentUserContex";
import { io } from "socket.io-client";
import api from "../lib/api";

const apiUrl = import.meta.env.VITE_API_URL;

interface GroupContextType {
  groups: Group[];
  activeGroup: Group | null;
  showCreateGroup: boolean;
  setShowCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
  requestLoadingId: string | null;
  joinRequests: JoinRequest[];
  activeGroupId: string;
  setActiveGroupId: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  members: GroupMember[];
  onlineMembers: GroupMember[];
  joined: boolean;
  loading: boolean;
  fetchJoinRequests: (groupId: string) => Promise<void>;
  handleJoinRequest: (groupId: string) => Promise<void>;
  setJoined: (val: boolean, groupId?: string) => Promise<void>;
  kickMember: (groupId: string, memberId: string) => Promise<void>;
  handleCreateGroup: (
    data: Omit<Group, "id" | "postCount" | "joined" | "members">,
  ) => Promise<void>;
  approveJoinRequest: (groupId: string, userId: string) => Promise<void>;
  cancelJoinRequest: (groupId: string, userId: string) => Promise<void>;
  rejectJoinRequest: (groupId: string, userId: string) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | null>(null);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("Posts");
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestLoadingId, setRequestLoadingId] = useState<string | null>(null);
  const { currentUser, isLoading } = useCurrentUser();
  const socket = useMemo(() => io(apiUrl), []);
  const token = localStorage.getItem("token");
  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;
  const members = activeGroup?.members ?? [];
  const onlineMembers = members.filter((m) => m.user.isOnline);
  const joined = activeGroup?.joined ?? false;

  const activeGroupIdRef = React.useRef(activeGroupId);
  activeGroupIdRef.current = activeGroupId;

  const getAllGroup = useCallback(async () => {
    if (!token || !currentUser?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/group/retrieveAll`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGroups(data);

        const joinedGroups = data.filter((g: Group) => g.joined === true);
        if (joinedGroups.length > 0 && !activeGroupIdRef.current) {
          setActiveGroupId(joinedGroups[0].id);
          await fetchJoinRequests(joinedGroups[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentUser?.id]);

  const fetchJoinRequests = useCallback(
    async (groupId: string) => {
      if (!token) return;

      try {
        const response = await api.get(`/group/get-requests/${groupId}`);
        if (response.data.success) {
          setJoinRequests(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch join requests:", error);
      }
    },
    [token],
  );

  const handleJoinRequest = useCallback(
    async (groupId: string) => {
      if (!token) return;
      setRequestLoadingId(groupId);
      try {
        await api.post(`/group/request-join/${groupId}`);
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, requestStatus: "pending" } : g,
          ),
        );
      } catch (error) {
        console.error("Failed to send join request:", error);
      } finally {
        setRequestLoadingId(null);
      }
    },
    [token],
  );

  const setJoined = useCallback(
    async (val: boolean, groupId?: string) => {
      if (!token) return;

      const targetId = groupId ?? activeGroupId;
      const url = val
        ? `${apiUrl}/group/join/${targetId}`
        : `${apiUrl}/group/leave/${targetId}`;
      const method = val ? "POST" : "DELETE";

      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setGroups((prev) =>
            prev.map((g) => {
              if (g.id !== targetId) return g;

              const newMember: GroupMember = {
                user: {
                  id: currentUser!.id,
                  firstname: currentUser!.firstname,
                  lastname: currentUser!.lastname,
                  avatar: currentUser!.avatar,
                  program: currentUser!.program,
                  accountType: currentUser!.accountType,
                  isOnline: true,
                  isVerified: currentUser!.isVerified,
                },
                isAdmin: false,
                joinedAt: new Date().toISOString(),
              };

              return {
                ...g,
                joined: val,
                members: val
                  ? [...g.members, newMember]
                  : g.members.filter((m) => m.user.id !== currentUser!.id),
              };
            }),
          );

          if (!val) await getAllGroup();
        }
      } catch (error) {
        console.error("Failed to join/leave group:", error);
      }
    },
    [token, activeGroupId, currentUser, getAllGroup],
  );

  const handleCreateGroup = useCallback(
    async (data: Omit<Group, "id" | "postCount" | "joined" | "members">) => {
      if (!token) return;

      try {
        const response = await fetch(`${apiUrl}/group/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          await getAllGroup();
          setActiveGroupId(result.group.id);
          setShowCreateGroup(false);
        }
      } catch (error) {
        console.error("Failed to create group:", error);
      }
    },
    [token, getAllGroup],
  );

  const kickMember = useCallback(
    async (groupId: string, memberId: string) => {
      if (!token) return;

      try {
        const response = await fetch(
          `${apiUrl}/group/kick/${groupId}/${memberId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          setGroups((prev) =>
            prev.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    members: g.members.filter((m) => m.user.id !== memberId),
                  }
                : g,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to kick member:", error);
      }
    },
    [token],
  );

  const approveJoinRequest = useCallback(
    async (groupId: string, userId: string) => {
      if (!token) return;

      try {
        await fetch(`${apiUrl}/group/approve-request/${groupId}/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setJoinRequests((prev) => prev.filter((r) => r.user_id !== userId));
        await getAllGroup();
        await fetchJoinRequests(groupId);
      } catch (error) {
        console.error("Failed to approve join request:", error);
      }
    },
    [token, getAllGroup, fetchJoinRequests],
  );

  const rejectJoinRequest = useCallback(
    async (groupId: string, userId: string) => {
      if (!token) return;

      try {
        await fetch(`${apiUrl}/group/reject-request/${groupId}/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setJoinRequests((prev) => prev.filter((r) => r.user_id !== userId));
        await getAllGroup();
        await fetchJoinRequests(groupId);
      } catch (error) {
        console.error("Failed to reject join request:", error);
      }
    },
    [token, getAllGroup, fetchJoinRequests],
  );

  const cancelJoinRequest = useCallback(
    async (groupId: string, userId: string) => {
      if (!token) return;
      setRequestLoadingId(groupId);
      try {
        await fetch(`${apiUrl}/group/cancel-request/${groupId}/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, requestStatus: null } : g,
          ),
        );
      } catch (error) {
        console.error("Failed to cancel join request:", error);
      } finally {
        setRequestLoadingId(null);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!isLoading && currentUser?.id) {
      getAllGroup();
    }
  }, [isLoading, currentUser?.id, getAllGroup]);

  useEffect(() => {
    const handleStatusChange = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          members: g.members.map((m) =>
            m.user.id === userId ? { ...m, user: { ...m.user, isOnline } } : m,
          ),
        })),
      );
    };

    socket.on("user_status_change", handleStatusChange);
    return () => {
      socket.off("user_status_change", handleStatusChange);
    };
  }, [socket]);

  return (
    <GroupContext.Provider
      value={{
        requestLoadingId,
        cancelJoinRequest,
        joinRequests,
        fetchJoinRequests,
        handleJoinRequest,
        handleCreateGroup,
        kickMember,
        approveJoinRequest,
        rejectJoinRequest,
        groups,
        activeGroup,
        showCreateGroup,
        setShowCreateGroup,
        activeGroupId,
        setActiveGroupId,
        activeTab,
        setActiveTab,
        members,
        onlineMembers,
        joined,
        loading,
        setJoined,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used inside GroupProvider");
  return context;
};
