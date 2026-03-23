import React from "react";
import { Divider } from "../../ui";
import { X } from "lucide-react";
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
  { id: "newest", label: "Newest & Recent", icon: "✨", sub: "" },
  { id: "popular", label: "Popular Today", icon: "🔥", sub: "" },
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
    <div className="pt-5 mt-[60px] md:mt-0">
      <div className="mb-5">
        {filters.map((f, index) => (
          <button
            key={f.id || index}
            onClick={() => {
              onFilterChange(f.id);
              onClose?.();
            }}
            className={`sidebar-item mb-1 border ${
              activeFilter === f.id
                ? "bg-orange-500/10 border-orange-500/20"
                : "border-transparent hover:bg-base-hover"
            }`}
          >
            <span className="text-base shrink-0">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  activeFilter === f.id ? "text-brand" : "text-text-secondary"
                }`}
              >
                {f.label}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">{f.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <Divider className="mb-5" />
      <div className="text-[10px] font-bold text-text-muted tracking-[1.2px] uppercase mb-2 pl-0.5">
        Popular tags
      </div>
      {popularTags.map((tag) => (
        <div
          key={tag}
          className={`${activeTag === tag && "border-b border-orange-500/80"}`}
        >
          <button
            onClick={() => {
              onTagClick(tag);
              onClose?.();
            }}
            className={`sidebar-item mb-0.5`}
          >
            <div className="flex-1 min-w-0">
              <div
                className={`text-xs font-semibold truncate ${activeTag === tag ? "text-brand" : "text-text-secondary"}`}
              >
                {tag}
              </div>
            </div>
          </button>
        </div>
      ))}

      <Divider className="mb-4" />

      <div>
        <div className="text-[10px] font-bold text-text-muted tracking-[1.2px] uppercase mb-2 pl-0.5">
          Sponsored
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-3 overflow-hidden relative group cursor-pointer hover:border-purple-500/40 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0" />

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

            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-[11px] font-bold py-1.5 rounded-md transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="h-10" />
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
            className="absolute top-0 left-0 h-full w-64 bg-base-elevated border-r border-white/10 shadow-2xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-base-elevated z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Browse
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
              >
                <X size={15} />
              </button>
            </div>
            <div className="px-3">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
