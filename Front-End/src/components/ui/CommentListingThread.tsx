import { useState } from "react";
import { Comment } from "../../types";
import { Avatar } from "../ui";
import { Heart, SendHorizontal, ChevronDown } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";

interface ListingCommentThreadProps {
  comment: Comment;
  comments: Comment[];
  onLike: (id: string) => void;
  onReply: (parentId: string, text: string) => void;
}

const TEXT_LIMIT = 150;

const countAllReplies = (commentId: string, allComments: Comment[]): number => {
  const direct = allComments.filter((r) => r.parentId === commentId);
  return direct.reduce((acc, r) => acc + 1 + countAllReplies(r.id, allComments), 0);
};

const ListingCommentThread: React.FC<ListingCommentThreadProps> = ({ comment: c, comments, onLike, onReply }) => {
  const [activeReply, setActiveReply] = useState(false);
  const [reply, setReply] = useState("");
  const [viewReplies, setViewReplies] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const replies = comments.filter((r) => r.parentId === c.id);
  const totalReplies = countAllReplies(c.id, comments);
  const isLong = c.text.length > TEXT_LIMIT;

  const timeAgo = (() => {
    if (!c.time) return "Just now";
    const now = new Date();
    const date = new Date(c.time);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  })();

  const submitReply = () => {
    if (!reply.trim()) return;
    onReply(c.id, reply);
    setReply("");
    setActiveReply(false);
    setViewReplies(true);
  };

  const getAuthorName = () => `${c.author.firstname ?? ""} ${c.author.lastname ?? ""}`.trim();
  const getAuthorInitials = () => (c.author.firstname?.[0] ?? "") + (c.author.lastname?.[0] ?? "");

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex gap-1 min-w-0">
        <div className="relative flex flex-col items-center shrink-0 w-8">
          <Avatar initials={getAuthorInitials()} size="sm" />
          {viewReplies && replies.length > 0 && (
            <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-700" />
          )}
        </div>

        <div className="flex-1 pb-3 min-w-0">
          <div className="bg-base-surface border border-border rounded-md p-3 shadow-sm hover:border-border-accent transition-colors">
            <div className="flex justify-between items-start mb-1 gap-2">
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-1.5 flex-wrap min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-text-primary truncate">{getAuthorName()}</span>
                  {c.author.isVerified && <FaCheckCircle size={11} className="text-green-500 shrink-0" />}
                </div>
                {c.author.program && (
                  <span className="text-[10px] sm:text-[11px] font-bold text-text-muted truncate">{`(${c.author.program})`}</span>
                )}
              </div>
              <span className="text-[10px] text-text-muted font-medium shrink-0">{timeAgo}</span>
            </div>

            {isLong && showFull && (
              <button onClick={() => setShowFull(false)} className="text-brand text-[10px] sm:text-xs font-semibold mb-1 hover:text-orange-400 transition-colors block">
                Show less
              </button>
            )}
            <p
              className="text-[11px] sm:text-[12px] md:text-[13px] text-text-secondary leading-relaxed break-words"
              style={!showFull && isLong ? { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
            >
              {c.text}
            </p>
            {isLong && (
              <button onClick={() => setShowFull((v) => !v)} className="text-brand text-[10px] sm:text-xs font-semibold mt-1 hover:text-orange-400 transition-colors">
                {showFull ? "Show less" : "Show more..."}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pr-4 gap-3 mt-1.5 ml-1">
            <div className="flex px-4 gap-3">
              <button
                onClick={() => onLike(c.id)}
                className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold active:scale-75 transition-colors ${c.liked ? "text-brand" : "text-text-muted hover:text-brand"}`}
              >
                <Heart size={14} fill={c.liked ? "currentColor" : "none"} />
                <span className="w-2 text-center">{c.likes}</span>
              </button>
              <button className="text-[9px] sm:text-[10px] font-bold text-text-muted hover:text-text-primary transition-colors" onClick={() => setActiveReply((v) => !v)}>
                REPLY
              </button>
            </div>
            {totalReplies > 0 ? (
              <button className="text-[9px] sm:text-[10px] flex items-center gap-0.5 font-bold text-text-muted hover:text-text-primary transition-colors" onClick={() => setViewReplies((v) => !v)}>
                {viewReplies ? `HIDE ${totalReplies} REPLIES` : totalReplies === 1 ? `VIEW 1 REPLY` : `VIEW ${totalReplies} REPLIES`}
                <ChevronDown size={13} className={`transition-transform duration-200 ${viewReplies ? "rotate-180" : ""}`} />
              </button>
            ) : <span />}
          </div>

          {activeReply && (
            <div className="relative mt-2 min-w-0">
              <input
                autoFocus
                value={reply}
                className="input-base pr-10 w-full min-w-0 text-[11px] sm:text-[13px]"
                placeholder="Write a reply..."
                onKeyDown={(e) => e.key === "Enter" && submitReply()}
                onChange={(e) => setReply(e.target.value)}
              />
              <button onClick={submitReply} disabled={!reply.trim()} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand disabled:text-text-muted transition-colors">
                <SendHorizontal size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {viewReplies && replies.length > 0 && (
        <div className="flex flex-col min-w-0">
          {replies.map((r, i) => (
            <div key={r.id} className="flex min-w-0">
              <div className="relative shrink-0 w-8">
                {i < replies.length - 1 && <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-700" />}
                <div className="absolute left-1/2 -translate-x-[1px] w-6 h-5 border-l-2 border-b-2 border-gray-700 rounded-bl-lg" style={{ top: 0 }} />
              </div>
              <div className="flex-1 min-w-0 pl-1">
                <ListingCommentThread comment={r} comments={comments} onLike={onLike} onReply={onReply} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingCommentThread;