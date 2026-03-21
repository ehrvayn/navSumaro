import React, { useState } from "react";
import { Post } from "../types";
import Feed from "../components/feed/Feed";
import LeftSidebar from "../components/layout/sidebar/HomeLeftSidebar";
import RightSidebar from "../components/layout/sidebar/HomeRightSidebar";
import { SlidersHorizontal, Menu } from "lucide-react";
import { usePosts } from "../context/PostContext";

const HomePage: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("newest");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const {
    setShowCreatePost,
    setSelectedPostId,
    searchQuery,
    getFilteredPosts,
  } = usePosts();

  const handleTagClick = (tag: string) =>
    setActiveTag(tag === activeTag || tag === "" ? null : tag);

  const filtered = getFilteredPosts(searchQuery)
    .filter((p) => !activeTag || p.tags.includes(activeTag))
    .sort((a, b) => {
      if (activeFilter === "popular") {
        return b.votes + b.views - (a.votes + a.views);
      }
      return 0;
    });

  return (
    <div className="relative h-[calc(100vh-60px)] pl-1 overflow-hidden">
      <div className="flex items-center justify-between py-2 pl-2 pr-3 lg:hidden border-b border-white/5">
        <button
          onClick={() => setLeftOpen(true)}
          className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all"
        >
          <Menu size={15} />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {activeFilter === "newest"
            ? "Newest & Recent"
            : activeFilter === "popular"
              ? "Popular Today"
              : "Following"}
        </span>
        <button
          onClick={() => setRightOpen(true)}
          className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] px-2 gap-6 items-start">
        <LeftSidebar
          activeTag={activeTag}
          onTagClick={handleTagClick}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          isOpen={leftOpen}
          onClose={() => setLeftOpen(false)}
        />
        <div className="min-w-0 h-[calc(100vh-56px)] overflow-y-auto">
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
        <RightSidebar isOpen={rightOpen} onClose={() => setRightOpen(false)} />
      </div>
    </div>
  );
};

export default HomePage;
