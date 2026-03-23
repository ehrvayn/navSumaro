import React, { useState, useEffect } from "react";
import { Avatar } from "../../components/ui";
import { useMessages } from "../../context/MessageContext";
import ConversationPage from "./ConversationPage";
import { Search, Edit, Users, MessageCircleMore } from "lucide-react";

const tabs = [
  { label: "Messages", icon: MessageCircleMore },
  { label: "People", icon: Users },
];

const MessagesPage: React.FC = () => {
  const {
    setSelectedConversation,
    selectedConversation,
    threads,
    setThreads,
  } = useMessages();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Messages");
  const [loading, setLoading] = useState(false);

  if (selectedConversation) {
    return (
      <ConversationPage
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const filteredThreads = threads.filter((t) =>
    `${t.firstname} ${t.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  const online = threads.filter((t) => t.isOnline);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn py-6">
      <div className="flex gap-6">
        <div className="w-64 shrink-0 pl-5 hidden md:flex flex-col gap-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-extrabold text-text-primary">Messages</h1>
            <button className="p-2 rounded-xl text-text-muted hover:bg-base-hover transition-colors">
              <Edit size={16} />
            </button>
          </div>

          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <Search size={14} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-base border border-border rounded-md pl-8 pr-3 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors placeholder:text-text-muted"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(tab.label);
                    if (tab.label !== "Messages") setSelectedConversation(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeTab === tab.label
                      ? "bg-brand text-white"
                      : "text-text-muted hover:bg-base-hover"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {online.length > 0 && activeTab === "Messages" && !search && (
            <div className="mt-4">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-3 px-1">
                Active Now
              </p>
              <div className="flex flex-col gap-1">
                {online.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedConversation(t)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-base-hover transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar initials={t.avatar} size="xs" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-base" />
                    </div>
                    <span className="text-xs text-text-primary font-medium truncate">
                      {t.firstname}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="px-4">
            <div className="md:hidden flex items-center justify-between mb-4">
              <h1 className="text-lg font-extrabold text-text-primary">Messages</h1>
              <button className="p-2 rounded-xl text-text-muted hover:bg-base-hover transition-colors">
                <Edit size={16} />
              </button>
            </div>

            <div className="md:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    onClick={() => {
                      setActiveTab(tab.label);
                      if (tab.label !== "Messages") setSelectedConversation(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-all ${
                      activeTab === tab.label
                        ? "bg-brand text-white"
                        : "bg-base-surface border border-border text-text-muted"
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="md:hidden relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Search size={14} />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-base border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors placeholder:text-text-muted"
              />
            </div>
          </div>

          {activeTab === "Messages" && (
            <div className="bg-base-surface border border-border rounded-none md:rounded-lg overflow-hidden">
              {loading ? (
                <div className="py-12 text-center text-text-muted text-sm">Loading...</div>
              ) : filteredThreads.length === 0 ? (
                <div className="py-12 text-center text-text-muted text-sm">No conversations found</div>
              ) : (
                filteredThreads.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setThreads((prev) =>
                        prev.map((thread) =>
                          thread.id === t.id ? { ...thread, unread: 0 } : thread
                        )
                      );
                      setSelectedConversation(t);
                    }}
                    className="flex gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-base-hover cursor-pointer transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar initials={(t.firstname[0]) + (t.lastname[0])} size="sm" />
                      {t.isOnline && (
                        <span className="absolute bottom-1.5 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-base-surface" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-xs font-bold ${t.unread > 0 ? "text-text-primary" : "text-text-secondary"}`}>
                          {t.firstname} {t.lastname}
                        </span>
                        <span className="text-[10px] text-text-muted shrink-0 ml-2">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className={`text-[11px] truncate ${t.unread > 0 ? "text-text-primary font-medium" : "text-text-muted"}`}>
                          {t.lastMessage}
                        </div>
                        {t.unread > 0 && (
                          <span className="w-4 h-4 bg-brand rounded-full text-[9px] text-white flex items-center justify-center shrink-0">
                            {t.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "People" && (
            <div className="bg-base-surface border border-border rounded-2xl overflow-hidden">
              {filteredThreads.length === 0 ? (
                <div className="py-12 text-center text-text-muted text-sm">No people found</div>
              ) : (
                filteredThreads.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-base-hover cursor-pointer transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar initials={t.avatar} size="sm" />
                      {t.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-base-surface" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-text-primary">
                        {t.firstname} {t.lastname}
                      </div>
                      <div className="text-[11px] text-text-muted">{t.program}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-brand/10 text-brand text-[11px] font-semibold hover:bg-brand/20 transition-colors shrink-0">
                      Message
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;