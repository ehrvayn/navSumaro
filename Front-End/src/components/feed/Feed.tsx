import React from "react";
import { Post } from "../../types";
import PostCard from "./PostCard";
import CreatePostBar from "./CreatePostBar";
import { usePosts } from "../../context/PostContext";
import { useCurrentUser } from "../../context/CurrentUserContex";

interface FeedProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onCreatePost: () => void;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
  searchQuery: string;
  showCreatePostCard: boolean;
}

const Feed: React.FC<FeedProps> = ({
  posts,
  onPostClick,
  onCreatePost,
  activeTag,
  onTagClick,
  searchQuery,
  showCreatePostCard,
}) => {
  const { postUserProfileId } = usePosts();
  const { currentUser } = useCurrentUser();

  return (
    <main className="flex flex-col w-full max-w-[800px] py-5 pb-16 mx-auto animate-fadeIn">
      {(showCreatePostCard || currentUser?.id === postUserProfileId) && (
        <CreatePostBar onOpen={onCreatePost} />
      )}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm font-semibold text-text-secondary mb-1.5">
            No posts found
          </div>
          <div className="text-xs text-text-muted">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : `No posts tagged ${activeTag}`}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post, i) => (
            <div key={post.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <PostCard
                post={post}
                onClick={onPostClick}
                activeTag={activeTag}
                onTagClick={onTagClick}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Feed;
