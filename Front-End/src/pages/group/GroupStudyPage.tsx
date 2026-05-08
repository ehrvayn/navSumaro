import React, { useState, useEffect } from "react";
import { Post } from "../../types";
import { Menu, School, SlidersHorizontal, User, LogOut } from "lucide-react";
import { useGroup } from "../../context/GroupContex";
import { usePosts } from "../../context/PostContext";
import GroupChat from "./GroupChat";
import GroupRightSidebar from "../../components/layout/sidebar/GroupRightSidebar";
import GroupLeftSidebar from "../../components/layout/sidebar/GroupLeftSidebar";
import Feed from "../../components/feed/Feed";
import GroupMembers from "./GroupMembers";
import { useMessages } from "../../context/MessageContext";
import api from "../../lib/api";
import DiscoverGroups from "./DiscoverGroup";
import { FaLock } from "react-icons/fa6";
import { BsGlobeAmericasFill } from "react-icons/bs";
import { GroupConversation } from "../../types";
import GroupRequests from "./GroupRequests";

const GroupStudyPage: React.FC = () => {
  const {
    activeGroup,
    activeGroupId,
    setActiveGroupId,
    activeTab,
    setActiveTab,
    onlineMembers,
    setJoined,
    groups,
    fetchJoinRequests,
  } = useGroup();
  const {
    setShowCreatePost,
    setSelectedPostId,
    searchQuery,
    getGroupPosts,
    getGroupPostsById,
  } = usePosts();

  const { setGroupConversations, socket } = useMessages();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [groupUnread, setGroupUnread] = useState<Record<string, number>>({});
  const joinedGroups = groups.filter((g) => g.joined);
  const hasJoined = joinedGroups.length > 0;

  const TABS = ["Posts", "Chats", "Members", "Discover"];
  if (!activeGroup?.isPublic) {
    TABS.push("Requests");
  }

  const handleGroupSelect = async (groupId: string) => {
    setActiveGroupId(groupId);
    await fetchJoinRequests(groupId);
    await fetchGroupMessages(groupId);
    getGroupPosts(groupId);
  };

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

  const fetchGroupMessages = async (groupId: string) => {
    setLoadingMessages(true);
    try {
      const response = await api.get(`/group/messages/get/${groupId}`);
      const data = response.data;
      setGroupMessages(data.success ? data.data : []);

      setGroupConversations((prev) => [
        ...prev.filter((c) => c.id !== groupId),
        {
          id: groupId,
          messages: data.data || [],
          title: activeGroup?.name || "",
          avatar: activeGroup?.emoji || "",
          participants: activeGroup?.members || [],
          isGroup: true,
          adminId:
            activeGroup?.members.find((m) => m.isAdmin)?.user.id ?? groupId,
          lastMessage: "",
          lastTime: "",
          unread: 0,
        } as GroupConversation,
      ]);
    } catch (error) {
      console.error("Failed to fetch group messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleChatTab = () => {
    setActiveTab("Chats");
    setGroupUnread((prev) => ({
      ...prev,
      [activeGroupId]: 0,
    }));
  };

  const handleGroupMessage = (newMessage: any) => {
    if (newMessage.groupId === activeGroupId) {
      setGroupMessages((prev) => {
        const exists = prev.some((msg) => msg.id === newMessage.id);
        return exists ? prev : [...prev, newMessage];
      });
    } else {
      setGroupUnread((prev) => ({
        ...prev,
        [newMessage.groupId]: (prev[newMessage.groupId] || 0) + 1,
      }));
    }
  };

  const filtered = getGroupPostsById(activeGroupId).filter((p: Post) => {
    const matchSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t: string) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  const totalUnreadChats = Object.values(groupUnread).reduce(
    (sum, count) => sum + count,
    0,
  );

  useEffect(() => {
    socket.on("receive_group_message", handleGroupMessage);
    return () => {
      socket.off("receive_group_message", handleGroupMessage);
    };
  }, [socket, activeGroupId]);

  return (
    <div className="flex h-[calc(100vh-60px)] pl-1 overflow-hidden fixed inset-0 mt-[120px] md:relative md:mt-0">
      <GroupLeftSidebar
        activeGroupId={activeGroupId}
        onGroupSelect={handleGroupSelect}
        isOpen={leftOpen}
        onClose={() => setLeftOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <div className="flex-shrink-0 bg-base border-b border-border">

          <div className="flex justify-between border-b  border-white/5 items-center gap-2 lg:hidden px-3 py-3">
            <button
              onClick={() => setLeftOpen(!leftOpen)}
              className="p-2 rounded-md hover:bg-base-hover transition-colors text-text-muted"
            >
              <Menu size={16} />
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Groups
            </span>
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className="p-2 rounded-md hover:bg-base-hover transition-colors text-text-muted"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {hasJoined && activeGroup && (
            <div className="px-3 sm:px-5 pt-4">
              <div className="relative rounded-lg border flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-orange-500/10 p-3 sm:p-4 mb-2 sm:mb-3 overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">
                    {activeGroup.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                      <h1 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {activeGroup.name}
                      </h1>
                      {activeGroup.isPublic ? (
                        <div className="flex items-center gap-1 text-text-muted flex-shrink-0">
                          <BsGlobeAmericasFill size={10} />
                          <span className="text-[9px] sm:text-[10px]">
                            public
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-text-muted flex-shrink-0">
                          <FaLock size={10} />
                          <span className="text-[9px] sm:text-[10px]">
                            private
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] text-text-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <User size={10} />
                        {activeGroup.members.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <School size={10} />
                        {activeGroup.university}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLeave}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors flex-shrink-0 w-full sm:w-auto"
                >
                  <LogOut size={13} />
                  Leave
                </button>
              </div>

              <div className="flex sm:justify-center border border-border -mr-2 -ml-3 sm:-ml-5 sm:-mr-4 lg:-mr-5 px-3 sm:px-5 overflow-x-auto">
                <div className="flex sm:gap-16">
                  {TABS.map((tab) => {
                    const unreadCount = tab === "Chats" ? totalUnreadChats : 0;

                    return (
                      <div
                        className={`${
                          activeTab === tab
                            ? "border-b-2 border-t-2 border-orange-500"
                            : "border-b-2 border-t-2 border-orange-500/0"
                        }`}
                      >
                        <button
                          key={tab}
                          onClick={() =>
                            tab === "Chats"
                              ? handleChatTab()
                              : setActiveTab(tab)
                          }
                          className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                            activeTab === tab
                              ? "text-brand border-orange-500"
                              : "text-text-muted border-transparent hover:text-text-primary"
                          }`}
                        >
                          {tab}
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!hasJoined && (
            <div className="px-3 sm:px-5 py-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🧭</div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-text-primary mb-1">
                    Find your study group
                  </h2>
                  <p className="text-[11px] text-text-muted">
                    Join a group or create one to get started
                  </p>
                </div>
              </div>
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

          {hasJoined && activeTab === "Requests" && (
            <div className="absolute inset-0 overflow-y-auto p-3 sm:p-5 overscroll-contain">
              <GroupRequests />
            </div>
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
