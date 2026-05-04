import React from "react";
import { Divider } from "../../ui";
import { X, Zap, Clock, Lightbulb, Users } from "lucide-react";
import { usePosts } from "../../../context/PostContext";

interface LeftSidebarProps {
  activeTag: string | null;
  onTagClick: (tag: string) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const filters = [
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "popular", label: "Most Discussed", icon: Zap },
];

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onTagClick,
  activeTag,
  activeFilter,
  onFilterChange,
  isOpen,
  onClose,
}) => {
  const { popularTags } = usePosts();
  const content = (
    <div className="pt-5 mt-[60px] md:mt-0 flex flex-col h-full">
      <div className="flex-1">
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">
            Sort
          </h3>
          <div className="space-y-2">
            {filters.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    onFilterChange(f.id);
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    activeFilter === f.id
                      ? "bg-brand text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-base-hover"
                  }`}
                >
                  <Icon size={13} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <Divider className="mb-6" />

        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">
            Topics
          </h3>
          <div className="space-y-1">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onTagClick(tag);
                  onClose?.();
                }}
                className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                  activeTag === tag
                    ? "bg-brand/20 text-brand font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-base-hover"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <Divider className="mb-6" />

        <div>
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">
            advertisement
          </h3>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-md p-3 overflow-hidden relative group cursor-pointer hover:border-purple-500/40 transition-all">
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-md bg-purple-500/30 flex items-center justify-center text-[30px] shrink-0">
                  🏪
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-text-primary truncate">
                    Campus Cafe.
                  </h3>
                  <p className="text-[10px] text-text-muted">Coffee & Snacks</p>
                </div>
              </div>

              <p className="text-[10px] text-text-muted leading-relaxed">
                10% off for students. Visit us near campus!
              </p>

              <button
                onClick={() => alert("This feature is under Development!")}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white text-[11px] font-bold py-1.5 rounded-md transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb
                size={14}
                className="text-blue-400 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-blue-400 mb-1">
                  Community Tip
                </p>
                <p className="text-[10px] text-blue-300 leading-relaxed">
                  Be respectful, search before posting, and provide context for
                  better answers.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-center">

              <div className="flex items-center justify-center gap-1 text-[10px] text-text-secondary">
                <span>NavSumaro 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-[60px] shrink-0 pr-2 overflow-y-auto h-[calc(100vh-60px)]">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 left-0 h-full w-64 bg-base-elevated border-r border-border z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3 sticky top-0 bg-base-elevated z-10 border-b border-border">
              <h2 className="text-xs font-bold text-text-primary">Browse</h2>
              <button
                onClick={onClose}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-4">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
