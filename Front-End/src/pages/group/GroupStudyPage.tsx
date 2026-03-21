import React, { useState, useMemo, useEffect } from "react";
import { Post } from "../../types";
import { Menu, School, SlidersHorizontal, User } from "lucide-react";
import { useGroup } from "../../context/GroupContex";
import { usePosts } from "../../context/PostContext";
import GroupChat from "./GroupChat";
import GroupRightSidebar from "../../components/layout/sidebar/GroupRightSidebar";
import GroupLeftSidebar from "../../components/layout/sidebar/GroupLeftSidebar";
import Feed from "../../components/feed/Feed";
import GroupMembers from "./GroupMembers";
import { useMessages } from "../../context/MessageContext";
import DiscoverGroups from "./DiscoverGroup";
import { FaLock } from "react-icons/fa6";
import { BsGlobeAmericasFill } from "react-icons/bs";
import { GroupConversation } from "../../types";

const TABS = ["Posts", "Chats", "Members", "Discover"];

const GroupStudyPage: React.FC = () => {
  const {
    activeGroup,
    activeGroupId,
    setActiveGroupId,
    activeTab,
    setActiveTab,
    onlineMembers,
    joined,
    setJoined,
    groups,
  } = useGroup();
  const {
    setShowCreatePost,
    setSelectedPostId,
    searchQuery,
    getGroupPosts,
    getGroupPostsById,
  } = usePosts();
  const { groupConversations, setGroupConversations, socket } = useMessages();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [groupUnread, setGroupUnread] = useState<Record<string, number>>({});

  const joinedGroups = groups.filter((g) => g.joined);
  const hasJoined = joinedGroups.length > 0;

  useEffect(() => {
    const handleGroupMessage = (newMessage: any) => {
      if (newMessage.groupId === activeGroupId) {
        setGroupMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) {
            return prev;
          }
          return [...prev, newMessage];
        });
      } else {
        // Increment unread for other groups
        setGroupUnread((prev) => ({
          ...prev,
          [newMessage.groupId]: (prev[newMessage.groupId] || 0) + 1,
        }));
      }
    };

    socket.on("receive_group_message", handleGroupMessage);
    return () => {
      socket.off("receive_group_message", handleGroupMessage);
    };
  }, [socket, activeGroupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `http://localhost:5000/group/messages/get/${activeGroupId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setGroupConversations((prev) => [
            ...prev.filter((c) => c.id !== activeGroupId),
            {
              id: activeGroupId,
              messages: data.data || [],
              title: activeGroup?.name || "",
              avatar: activeGroup?.emoji || "",
              participants: activeGroup?.members || [],
              isGroup: true,
              adminId:
                activeGroup?.members.find((m) => m.isAdmin)?.user.id ??
                activeGroupId,
              lastMessage: "",
              lastTime: "",
              unread: 0,
            } as GroupConversation,
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (activeGroupId) {
      fetchMessages();
    }
  }, [activeGroupId, activeGroup]);

  const handleTagClick = (tag: string) =>
    setActiveTag((prev) => (prev === tag || tag === "" ? null : tag));

  const handleLeave = () => {
    setJoined(false);
    const remaining = joinedGroups.filter((g) => g.id !== activeGroupId);
    if (remaining.length > 0) {
      setActiveGroupId(remaining[0].id);
      setActiveTab("Posts");
    } else {
      setActiveTab("Discover");
    }
  };

  useEffect(() => {
    if (activeGroupId) {
      getGroupPosts(activeGroupId);
    }
  }, [activeGroupId]);

  useEffect(() => {
    if (activeTab === "Chats" && activeGroupId) {
      fetchGroupMessages(activeGroupId);
      // Clear unread when opening chats
      setGroupUnread((prev) => ({
        ...prev,
        [activeGroupId]: 0,
      }));
    }
  }, [activeTab, activeGroupId]);

  const fetchGroupMessages = async (groupId: string) => {
    setLoadingMessages(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/group/messages/get/${groupId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setGroupMessages(data.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch group messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filtered = getGroupPostsById(activeGroupId).filter((p) => {
    const matchSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="flex h-[calc(100vh-60px)] pl-1 overflow-hidden fixed inset-0 mt-[120px] md:relative md:mt-0">
      <GroupLeftSidebar
        activeGroupId={activeGroupId}
        onGroupSelect={setActiveGroupId}
        isOpen={leftOpen}
        onClose={() => setLeftOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <div className="flex-shrink-0 px-3 sm:px-5 pt-2 sm:pt-3 bg-base">
          <div className="flex items-center gap-2 lg:hidden mb-2">
            <button
              onClick={() => setLeftOpen(true)}
              className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-400"
            >
              <Menu size={15} />
            </button>
            <span className="text-sm font-bold text-slate-300 flex-1 truncate">
              {hasJoined ? activeGroup?.name : "Groups"}
            </span>
            <button
              onClick={() => setRightOpen(true)}
              className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-400"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>

          {hasJoined ? (
            <div className="relative rounded-lg border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-orange-500/10 p-3 sm:p-4 mb-2 sm:mb-3 overflow-hidden">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex items-center justify-center text-[40px] shadow-lg">
                  {activeGroup?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex gap-2 items-center">
                      <h1 className="text-base sm:text-lg font-extrabold text-slate-100 truncate">
                        {activeGroup?.name}
                      </h1>
                      {activeGroup?.isPublic ? (
                        <BsGlobeAmericasFill />
                      ) : (
                        <FaLock />
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={handleLeave}
                        className="px-3 py-1.5 rounded-md text-[11px] font-bold bg-red-700 text-white hover:bg-red-800 transition-colors"
                      >
                        LEAVE
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-[12px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {activeGroup?.members.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <School size={12} /> {activeGroup?.university}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-white/[0.08] bg-gradient-to-br from-blue-500/10 to-orange-500/5 p-4 mb-2 sm:mb-3 flex items-center gap-4">
              <div className="text-3xl">🧭</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-extrabold text-slate-300">
                  Find your study group
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Join a group or create one to get started
                </p>
              </div>
              <span className="shrink-0 px-3 py-1.5 rounded-md text-[11px] font-bold border border-orange-500 text-orange-500">
                Discover
              </span>
            </div>
          )}

          {hasJoined && (
            <div className="flex gap-1 border-b border-white/[0.07]">
              {TABS.map((tab) => {
                const totalUnread =
                  tab === "Chats"
                    ? Object.values(groupUnread).reduce(
                        (sum, count) => sum + count,
                        0,
                      )
                    : 0;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm border-b-2 transition-all relative ${activeTab === tab ? "border-orange-500 text-orange-400 font-bold" : "border-transparent text-slate-500"}`}
                  >
                    {tab}
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden relative">
          {hasJoined && activeTab === "Posts" && (
            <div className="absolute inset-0 overflow-y-auto p-3 sm:p-5 overscroll-contain">
              <Feed
                showCreatePostCard={true}
                posts={filtered}
                onPostClick={(post: Post) => setSelectedPostId(post.id)}
                onCreatePost={() => setShowCreatePost(true)}
                activeTag={activeTag}
                onTagClick={handleTagClick}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {hasJoined && activeTab === "Chats" && activeGroup && (
            <GroupChat
              key={activeGroupId}
              conversation={{
                id: activeGroupId,
                title: activeGroup.name,
                avatar: activeGroup.emoji,
                participants: activeGroup.members,
                messages: groupMessages,
                isGroup: true,
                adminId:
                  activeGroup.members.find((m) => m.isAdmin)?.user.id ??
                  activeGroupId,
                lastMessage: activeGroup.name,
                lastTime: new Date().toLocaleTimeString(),
                unread: 0,
              }}
            />
          )}
          {hasJoined && activeTab === "Members" && (
            <div className="absolute inset-0 overflow-y-auto p-3 sm:p-5 overscroll-contain">
              <GroupMembers members={activeGroup?.members ?? []} />
            </div>
          )}

          {(!hasJoined || activeTab === "Discover") && (
            <div className="absolute inset-0 overflow-y-auto p-3 sm:p-5 overscroll-contain">
              <DiscoverGroups groups={groups} />
            </div>
          )}
        </div>
      </main>

      <GroupRightSidebar
        onlineMembers={onlineMembers}
        activeGroup={activeGroup}
        handleTagClick={handleTagClick}
        isOpen={rightOpen}
        onClose={() => setRightOpen(false)}
      />
    </div>
  );
};

export default GroupStudyPage;
