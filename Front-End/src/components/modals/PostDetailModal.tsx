import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Post, Comment, User, Organization } from "../../types";
import { Avatar, Tag } from "../ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import CommentThread from "../ui/CommentPostThread";
import { usePosts } from "../../context/PostContext";
import { IoArrowRedoOutline } from "react-icons/io5";
import { IoArrowRedoSharp } from "react-icons/io5";
import { LiaCommentDots } from "react-icons/lia";
import { FaCheckCircle } from "react-icons/fa";
import { usePage } from "../../context/PageContex";
import { ArrowRight, SendHorizontal } from "lucide-react";

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

const TITLE_LIMIT: number = 120;
const BODY_LIMIT: number = 180;

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const {
    getComments,
    addComment,
    likeComment,
    handleVote,
    fetchComments,
    setPostUserProfileId,
    getUserData,
    setSelectedPostId,
  } = usePosts();
  const [comment, setComment] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullBody, setShowFullBody] = useState(false);
  const comments = getComments(post.id);
  const { currentUser } = useCurrentUser();
  const isTitleLong = post.title.length > TITLE_LIMIT;
  const isBodyLong = (post.body?.length ?? 0) > BODY_LIMIT;
  const { setActivePage } = usePage();

  const timeAgo = (() => {
    const now = new Date();
    const date = new Date(post.createdAt);
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchComments(post.id);
    return () => {
      document.body.style.overflow = "";
    };
  }, [post.id]);

  const handleReply = useCallback(
    (parentId: string, text: string) => {
      if (!text.trim() || !currentUser) return;
      addComment(post.id, text, parentId);
    },
    [post.id, currentUser],
  );

  const submitComment = useCallback(() => {
    if (!comment.trim() || !currentUser) return;
    addComment(post.id, comment, null);
    setComment("");
  }, [comment, post.id, currentUser]);

  const handleCommentLike = useCallback(
    (id: string) => {
      likeComment(post.id, id);
    },
    [post.id],
  );

  const topLevel = useMemo(
    () => comments.filter((c) => c.parentId === null),
    [comments],
  );

  if (!currentUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border border-border-accent rounded-0 md:rounded-lg md:w-[640px] w-full h-[87vh] md:h-[90vh] md:mt-[60px] mt-[120px] flex flex-col animate-scaleIn shadow-2xl overflow-hidden"
      >
        <div
          className="border-b border-border shrink-0 flex flex-col"
          style={{ maxHeight: "50%" }}
        >
          <div className="p-4 md:p-6 pb-0 overflow-y-auto flex-1 min-h-0">
            {!showFullTitle && !showFullBody && (
              <div className="flex justify-between items-start gap-3 mb-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                  {!showAllTags && (
                    <span
                      className={`text-[7px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider shrink-0 ${
                        post.type === "question"
                          ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          : post.type === "discussion"
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : post.type === "resource"
                              ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                              : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {post.type}
                    </span>
                  )}

                  {!showAllTags && post.tags.length > 0 && (
                    <span className="text-sm text-text-muted shrink-0">|</span>
                  )}

                  <div
                    className={`${showAllTags && "w-[100%] max-w-[100%]"} flex flex-wrap w-[50%] sm:w-[80%] max-w-[70%] min-w-50px gap-1.5`}
                    style={{
                      maxHeight: showAllTags ? "none" : "25px",
                      overflow: "hidden",
                    }}
                  >
                    {post.tags.map((tag) => (
                      <Tag key={tag} label={tag} active />
                    ))}
                  </div>

                  {post.tags.length > 3 && (
                    <button
                      onClick={() => setShowAllTags((v) => !v)}
                      className="text-[8px] sm:text-[10px] font-bold text-brand hover:underline shrink-0"
                    >
                      {showAllTags
                        ? "SHOW LESS"
                        : `+${post.tags.length - 3} TAGS`}
                    </button>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 text-text-muted text-[11px] sm:text-[13px] items-center flex hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors shrink-0"
                >
                  Back
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            )}

            {!showAllTags && (
              <div className="mb-1">
                {!showFullBody && post.title && (
                  <>
                    {isTitleLong && showFullTitle && (
                      <button
                        onClick={() => {
                          setShowFullTitle(false);
                          setShowFullBody(false);
                        }}
                        className="text-brand text-[10px] sm:text-[12px] font-semibold mb-2 hover:text-orange-400 transition-colors block"
                      >
                        Show less
                      </button>
                    )}
                    <p
                      className="text-[12px] sm:text-[14px] md:text-[15px] py-2 sm:py-3 font-bold text-text-primary leading-tight mb-1 break-words"
                      style={
                        !showFullTitle && isTitleLong
                          ? {
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }
                          : undefined
                      }
                    >
                      {post.title}
                    </p>

                    {isTitleLong && (
                      <button
                        onClick={() => {
                          setShowFullTitle((v) => !v);
                          setShowFullBody(false);
                        }}
                        className="text-brand text-[10px] sm:text-[12px] font-semibold mb-2 hover:text-orange-400 transition-colors"
                      >
                        {showFullTitle ? "Show less" : "Show more..."}
                      </button>
                    )}
                  </>
                )}

                {!showFullTitle && post.body && (
                  <div className="border-t border-gray-700 pt-2 mt-1">
                    {isBodyLong && showFullBody && (
                      <button
                        onClick={() => setShowFullBody(false)}
                        className="text-orange-500 text-[10px] sm:text-[12px] font-semibold mb-2 hover:text-orange-400 transition-colors block"
                      >
                        Show less
                      </button>
                    )}
                    <p
                      className="text-[11px] sm:text-[13px] md:text-[13px] text-text-secondary leading-relaxed"
                      style={
                        !showFullBody && isBodyLong
                          ? {
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }
                          : undefined
                      }
                    >
                      {post.body}
                    </p>
                    {isBodyLong && (
                      <button
                        onClick={() => setShowFullBody((v) => !v)}
                        className="text-orange-500 text-[10px] sm:text-[12px] font-semibold mt-1 hover:text-orange-400 transition-colors"
                      >
                        {showFullBody ? "Show less" : "Show more..."}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-6 py-3 border-t border-border/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setPostUserProfileId(post.author.id);
                  setActivePage("profile");
                  getUserData(post.author.id);
                  setSelectedPostId(null);
                }}
              >
                <Avatar
                  initials={
                    post.author.accountType === "student"
                      ? ((post.author as User).firstname?.[0] ?? "") +
                        ((post.author as User).lastname?.[0] ?? "")
                      : ((post.author as Organization).name?.[0] ?? "")
                  }
                  size="sm"
                />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-text-primary">
                    {post.author.accountType === "student"
                      ? (post.author as User).firstname
                      : (post.author as Organization).name}
                  </span>
                  {post.author.isVerified && (
                    <FaCheckCircle size={12} className="text-green-500" />
                  )}
                </div>
                <div className="text-[9px] sm:text-[10px] text-text-muted">
                  {post.author.accountType === "student"
                    ? (post.author as User).program
                    : (post.author as Organization).organizationType}
                  <span className="text-sm"> | </span>
                  {timeAgo}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 md:gap-4 px-2 py-2 sm:p-0 bg-base-hover sm:bg-transparent rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-text-muted font-medium">
                  <LiaCommentDots
                    size={14}
                    className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                  />
                  <span>{post.comments}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 border-l border-border pl-4 sm:border-none sm:pl-0">
                <div className="flex items-center ml-[-5px] g">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(post.id, "up");
                    }}
                    className="flex items-center select-none active:scale-100 focus:outline-none"
                  >
                    {post.upVote ? (
                      <IoArrowRedoSharp className="-rotate-90 w-5 h-5 text-brand" />
                    ) : (
                      <IoArrowRedoOutline className="-rotate-90 w-5 h-5 text-text-muted" />
                    )}
                  </button>
                  <span className="text-text-muted text-[11px] w-4 text-center">
                    {post.votes}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(post.id, "down");
                    }}
                    className="flex items-center select-none active:scale-100 focus:outline-none"
                  >
                    {post.downVote ? (
                      <IoArrowRedoSharp className="rotate-90 w-5 h-5 text-brand" />
                    ) : (
                      <IoArrowRedoOutline className="rotate-90 w-5 h-5 text-text-muted" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-elevated custom-scrollbar">
          <div className="shrink-0 pb-4 border-b border-border/50">
            <h3 className="text-[10px] sm:text-[12px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              Comments
              <span className="bg-brand/10 text-brand px-2 py-0.5 rounded text-[9px] sm:text-[10px]">
                {comments.length}
              </span>
            </h3>
          </div>
          <div className="flex flex-col">
            {topLevel.map((c) => (
              <CommentThread
                key={c.id}
                comment={c}
                comments={comments}
                onLike={handleCommentLike}
                onReply={handleReply}
              />
            ))}
          </div>
        </div>

        <div className="p-3 md:p-4 bg-base-surface border-t border-border flex items-center gap-3">
          <Avatar
            initials={currentUser.avatar}
            size="sm"
            className="shrink-0"
          />
          <div className="relative flex-1">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Add your insight..."
              className="input-base pr-10 text-[11px] sm:text-[12px]"
            />
            <button
              onClick={submitComment}
              disabled={!comment.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand disabled:text-text-muted transition-colors"
            >
              <SendHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
