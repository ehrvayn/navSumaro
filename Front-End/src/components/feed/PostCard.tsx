import React from "react";
import { useMemo, useState } from "react";
import { Post, User } from "../../types";
import { Avatar, Tag } from "../ui";
import { usePosts } from "../../context/PostContext";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { IoArrowRedoOutline } from "react-icons/io5";
import { IoArrowRedoSharp } from "react-icons/io5";
import { LiaCommentDots } from "react-icons/lia";
import { FaCheckCircle } from "react-icons/fa";
import { usePage } from "../../context/PageContex";

import {
  HelpCircle,
  MessageSquare,
  Paperclip,
  Beaker,
  Eye,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  activeTag,
  onTagClick,
}) => {
  const {
    getComments,
    handleVote,
    setShowDeletePost,
    setDeletedPostId,
    setIsEditing,
    setEditPostId,
    postUserProfileId,
    setPostUserProfileId,
    getUserData,
  } = usePosts();
  const { currentUser } = useCurrentUser();
  const [openMenu, setOpenMenu] = useState(false);
  const { setActivePage } = usePage();

  const isOwnPost = currentUser && post.author.id === currentUser.id;

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

  return (
    <article
      onClick={() => onClick(post)}
      className="bg-base-surface border border-border rounded-md p-4 sm:pb-4 pb-0 cursor-pointer hover:border-orange-500/80"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {post.type === "question" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400">
              <HelpCircle size={12} strokeWidth={2.5} /> Question
            </span>
          )}
          {post.type === "discussion" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400">
              <MessageSquare size={12} strokeWidth={2.5} /> Discussion
            </span>
          )}
          {post.type === "resource" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400">
              <Paperclip size={12} strokeWidth={2.5} /> Resource
            </span>
          )}
          {post.type === "research" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/15 text-yellow-400">
              <Beaker size={12} strokeWidth={2.5} /> Research
            </span>
          )}
        </div>

        {isOwnPost && (
          <div className="relative">
            <EllipsisVertical
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(!openMenu);
              }}
              className="cursor-pointer text-text-muted hover:text-text-primary"
              size={20}
            />

            {openMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-32 bg-base-surface border border-border rounded-md shadow-lg z-50"
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-gray-700"
                  onClick={() => {
                    setIsEditing(true);
                    setEditPostId(post.id);
                    setOpenMenu(false);
                  }}
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeletedPostId(post.id);
                    setShowDeletePost(true);
                    setOpenMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-700"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-text-primary mb-3 line-clamp-2 break-words">
        {post.title}
      </h3>

      <div className="flex max-h-[50px] overflow-hidden gap-1.5 flex-wrap mb-4">
        {post.tags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            active={activeTag === tag}
            onClick={() => onTagClick(tag)}
          />
        ))}
      </div>

      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div className="flex items-center self-start py-3 gap-2">
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setPostUserProfileId(post.author.id);
              if (isOwnPost) {
                setActivePage("myprofile");
              } else {
                setActivePage("profile");
              }
              getUserData(post.author.id);
            }}
          >
            <Avatar
              initials={
                ((post.author as User).firstname?.[0] ?? "") +
                ((post.author as User).lastname?.[0] ?? "")
              }
              size="sm"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-text-primary">
                {post.author.accountType === "student" && post.author.firstname}
              </span>
              {post.author.isVerified && (
                <FaCheckCircle size={12} className="text-green-500" />
              )}
            </div>
            <div className="text-[10px] text-text-muted">
              {(post.author as User).program} <span className="text-sm">|</span>{" "}
              {timeAgo}
            </div>
          </div>
        </div>

        <div className="flex items-center sm:justify-center border-t sm:border-0 border-gray-700 px-10 py-2 sm:py-0 sm:px-0 sm:w-auto justify-between w-full gap-5">
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <Eye size={20} />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <LiaCommentDots size={18} />
            <span>{post.comments}</span>
          </div>
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
    </article>
  );
};

export default PostCard;
