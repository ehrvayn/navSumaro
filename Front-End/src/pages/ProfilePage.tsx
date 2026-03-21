import {
  User,
  Star,
  GraduationCap,
  BookOpen,
  Trophy,
  School,
} from "lucide-react";
import { useState } from "react";
import { usePosts } from "../context/PostContext";
import { Post } from "../types";
import Feed from "../components/feed/Feed";
import { FaCheckCircle } from "react-icons/fa";
import { Avatar } from "../components/ui";
import { AiFillMessage } from "react-icons/ai";
import { MdNavigateNext } from "react-icons/md";
import { useMessages } from "../context/MessageContext";
import ConversationPage from "./message/ConversationPage";
import { Message } from "../types";

function ProfilePage() {
  const {
    posts,
    setSelectedPostId,
    searchQuery,
    setShowCreatePost,
    postUserProfileId,
    draft,
  } = usePosts();
  const { setSelectedConversation, selectedConversation, Messages } =
    useMessages();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  if (!draft) return null;

  if (selectedConversation) {
    return (
      <ConversationPage
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const handleTagClick = (tag: string) =>
    setActiveTag(tag === activeTag || tag === "" ? null : tag);

  const filtered = posts.filter((p) => p.author?.id === draft.id);

  const fields: {
    key: keyof typeof draft;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: "firstname", label: "Firstname", icon: <User size={13} /> },
    { key: "lastname", label: "Lastname", icon: <User size={13} /> },
    {
      key: "university",
      label: "University",
      icon: <School size={13} />,
    },
    { key: "program", label: "Program", icon: <BookOpen size={13} /> },
    { key: "yearLevel", label: "yearLevel", icon: <GraduationCap size={13} /> },
  ];

  const handleMessage = () => {
    const existingThread = Messages.find(
      (m: any) =>
        m.participantId === draft.id || m.participant?.id === draft.id,
    );

    if (existingThread) {
      setSelectedConversation(existingThread);
    } else {
      const conversation: Message = {
        id: `conv-${Date.now()}`,
        participantId: draft.id,
        participant: {
          id: draft.id,
          firstname: draft.firstname,
          lastname: draft.lastname,
          avatar: draft.avatar,
          isOnline: false,
          isVerified: draft.isVerified,
          program: draft.program,
          accountType: "student",
        },
        messages: [],
        lastMessage: "",
        lastTime: "",
        unread: 0,
      };

      setSelectedConversation(conversation);
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto bg-base">
      <div className="max-w-[70%] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[320px] lg:sticky lg:top-6 flex flex-col gap-4 shrink-0">
            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="flex flex-col items-center gap-3 px-6 py-6">
                <Avatar
                  initials={
                    (draft.firstname?.[0] ?? "") + (draft.lastname?.[0] ?? "")
                  }
                  size="md"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <h1 className="text-[14px] font-black text-text-primary">
                      {draft.firstname} {draft.lastname}
                    </h1>
                    {draft.isVerified && (
                      <FaCheckCircle size={15} className="text-green-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {draft.program}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {draft.university}
                  </p>
                </div>
              </div>
            </div>

            <button
              className={`bg-base-elevated justify-between flex py-4 px-2 rounded-md items-center transition-all group relative`}
              onClick={handleMessage}
            >
              <div className="absolute inset-0 border-2 border-border rounded-md group-hover:border-orange-500/80 transition-colors pointer-events-none" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent relative z-10" />
              <h2 className="text-[10px] font-bold flex items-center gap-2 text-text-muted uppercase tracking-widest group-hover:text-orange-500/80 transition-colors relative z-10">
                <AiFillMessage
                  size={20}
                  className="group-hover:text-orange-500/80 transition-colors"
                />
                Message
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent relative z-10" />
            </button>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  icon: <Trophy size={13} className="text-brand" />,
                  label: "Rep",
                  value: draft.reputation,
                },
                {
                  icon: <GraduationCap size={13} className="text-blue-400" />,
                  label: "Year",
                  value: `Yr ${draft.yearLevel}`,
                },
                {
                  icon: <Star size={13} className="text-yellow-400" />,
                  label: "Badges",
                  value: draft.badges.length.toString(),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-base-elevated border border-border rounded-md p-3 flex flex-col items-center gap-1"
                >
                  {stat.icon}
                  <span className="text-[13px] font-black text-text-primary">
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Profile Info
                </h2>
              </div>
              <div className="divide-y divide-border">
                {fields.map(({ key, label, icon }) => (
                  <div key={key} className="px-4 py-3 flex items-center gap-3">
                    <div className="text-text-muted shrink-0">{icon}</div>
                    <div>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                        {label}
                      </p>
                      <p className="text-[12px] text-text-primary font-medium">
                        {String(draft[key])}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Badges
                </h2>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {draft.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      color: badge.color,
                      borderColor: badge.color + "44",
                      backgroundColor: badge.color + "11",
                    }}
                  >
                    <span>{badge.icon}</span>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="px-1 py-1 mb-3 border-b border-border">
              <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Posts · {filtered.length}
              </h2>
            </div>
            <Feed
              showCreatePostCard={false}
              posts={filtered}
              onPostClick={(post: Post) => setSelectedPostId(post.id)}
              onCreatePost={() => setShowCreatePost(true)}
              activeTag={activeTag}
              onTagClick={handleTagClick}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
