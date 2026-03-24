import React, { useState } from "react";
import { mockNotifications } from "../data/mockNotifications";
import { Avatar } from "../components/ui";
import { Bell, Check } from "lucide-react";
import { Notification } from "../types";

const typeLabel: Record<Notification["type"], string> = {
  like: "Liked",
  comment: "Comment",
  reply: "Reply",
  mention: "Mention",
  follow: "Follow",
  message: "Message",
  system: "System",
  "org-verified": "Verified",
  "org-rejected": "Rejected",
  "org-announcement": "Announcement",
};

const typeBadgeColor: Record<Notification["type"], string> = {
  like: "bg-red-500/10 text-red-400",
  comment: "bg-blue-500/10 text-blue-400",
  reply: "bg-purple-500/10 text-purple-400",
  mention: "bg-yellow-500/10 text-yellow-400",
  follow: "bg-green-500/10 text-green-400",
  message: "bg-brand/10 text-brand",
  system: "bg-gray-500/10 text-gray-400",
  "org-verified": "bg-green-500/10 text-green-400",
  "org-rejected": "bg-red-500/10 text-red-400",
  "org-announcement": "bg-orange-500/10 text-orange-400",
};

const filters = ["All", "Likes", "Comments", "Mentions", "Follows"];

const NotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [read, setRead] = useState<Set<number>>(new Set());

  const filtered = mockNotifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Likes") return n.type === "like";
    if (activeFilter === "Comments")
      return n.type === "comment" || n.type === "reply";
    if (activeFilter === "Mentions") return n.type === "mention";
    if (activeFilter === "Follows") return n.type === "follow";
    return true;
  });

  const unreadCount = mockNotifications.length - read.size;

  return (
    <div className="w-full md:max-w-2xl animate-fadeIn mx-auto py-6">
      <div className="px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-text-primary">
              Notifications (mock)
            </h1>
            {unreadCount > 0 && (
              <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setRead(new Set(mockNotifications.map((_, i) => i)))}
            className={`flex items-center gap-1.5 text-[11px] ${unreadCount ? "text-brand" : "text-text-muted"} font-semibold hover:opacity-80 transition-opacity`}
          >
            {unreadCount ? (
              "Mark as Read?"
            ) : (
              <>
                <Check size={13} />
                Mark as Read
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-all ${
                activeFilter === f
                  ? "bg-brand text-white"
                  : "bg-base-surface border border-border text-text-muted hover:bg-base-hover"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-surface border border-border rounded-none md:rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
            <Bell size={32} strokeWidth={1.5} />
            <p className="text-sm">No notifications here</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const isRead = read.has(i);
            return (
              <div
                key={i}
                onClick={() => setRead((prev) => new Set([...prev, i]))}
                className={`flex gap-3 px-4 py-3.5 border-b border-border last:border-0 cursor-pointer transition-colors ${
                  isRead
                    ? "hover:bg-base-hover"
                    : "bg-brand/5 hover:bg-brand/10"
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar initials={n.avatar} size="sm" />
                  {!isRead && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand rounded-full border-2 border-base-surface" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${typeBadgeColor[n.type]}`}
                    >
                      {typeLabel[n.type]}
                    </span>
                  </div>
                  <div
                    className={`text-xs leading-relaxed ${isRead ? "text-text-muted" : "text-text-primary font-medium"}`}
                  >
                    {n.text}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    {n.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
