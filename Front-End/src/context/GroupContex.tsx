import React, { createContext, useContext, useEffect, useState } from "react";
import { Group, GroupMember } from "../types";
import { useCurrentUser } from "./CurrentUserContex";
import { io } from "socket.io-client";

// shared socket singleton — same URL as MessageContext
const socket = io("http://localhost:5000");

interface GroupContextType {
  groups: Group[];
  activeGroup: Group | null;
  showCreateGroup: boolean;
  setShowCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
  activeGroupId: string;
  setActiveGroupId: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  members: GroupMember[];
  onlineMembers: GroupMember[];
  joined: boolean;
  setJoined: (val: boolean, groupId?: string) => void;
  kickMember: (groupId: string, memberId: string) => void;
  handleCreateGroup: (
    data: Omit<Group, "id" | "postCount" | "joined" | "members">,
  ) => void;
}

const GroupContext = createContext<GroupContextType | null>(null);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("Posts");
  const { currentUser } = useCurrentUser();

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;
  const members = activeGroup?.members ?? [];
  const onlineMembers = members.filter((m) => m.user.isOnline);
  const joined = activeGroup?.joined ?? false;

  useEffect(() => {
    getAllGroup();
  }, [currentUser]);

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
            m.user.id === userId
              ? { ...m, user: { ...m.user, isOnline } }
              : m,
          ),
        })),
      );
    };

    socket.on("user_status_change", handleStatusChange);
    return () => {socket.off("user_status_change", handleStatusChange)};
  }, []);

  const getAllGroup = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/group/retrieveAll", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
        if (data.length > 0 && !activeGroupId) {
          setActiveGroupId(data[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setJoined = async (val: boolean, groupId?: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const targetId = groupId ?? activeGroupId;
    const url = val
      ? `http://localhost:5000/group/join/${targetId}`
      : `http://localhost:5000/group/leave/${targetId}`;
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
      console.log(error);
    }
  };

  const handleCreateGroup = async (
    data: Omit<Group, "id" | "postCount" | "joined" | "members">,
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/group/create", {
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
      console.log(error);
    }
  };

  const kickMember = async (groupId: string, memberId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/group/kick/${groupId}/${memberId}`,
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
              ? { ...g, members: g.members.filter((m) => m.user.id !== memberId) }
              : g,
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        handleCreateGroup,
        kickMember,
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