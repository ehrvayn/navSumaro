import React from "react";
import { popularTags } from "../../../data/mockData";
import { Divider } from "../../ui";
import { X } from "lucide-react";

interface LeftSidebarProps {
  activeTag: string | null;
  onTagClick: (tag: string) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const filters = [
  { id: "newest", label: "Newest & Recent", icon: "🟢", sub: "Latest updates" },
  { id: "popular", label: "Popular Today", icon: "🔥", sub: "Featured by curators" },
  { id: "following", label: "Following", icon: "👤", sub: "From people you follow", badge: 24 },
];

const quickTags = ["#javascript", "#GroupStudy", "#design", "#blogging", "#tutorial"];

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTag,
  onTagClick,
  activeFilter,
  onFilterChange,
  isOpen,
  onClose,
}) => {
  const content = (
    <div className="pt-5">
      <div className="mb-5">
        {filters.map((f) => (
          <button
            key={f.id}
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
                {f.badge && (
                  <span className="bg-brand text-white text-[9px] font-bold px-1.5 py-px rounded-full leading-none">
                    {f.badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">{f.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <Divider className="mb-5" />

      <div className="mb-5">
        <div className="text-[10px] font-bold text-text-muted tracking-[1.2px] uppercase mb-2.5 pl-0.5">
          Popular Tags
        </div>
        {popularTags.map((t) => (
          <button
            key={t.tag}
            onClick={() => {
              onTagClick(activeTag === t.tag ? "" : t.tag);
              onClose?.();
            }}
            className={`sidebar-item mb-0.5 ${activeTag === t.tag ? "bg-base-hover" : ""}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.color.split(" ")[0]}`}>
              <span className={`text-[13px] font-bold ${t.color.split(" ")[1]}`}>#</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold truncate ${activeTag === t.tag ? "text-brand" : "text-text-secondary"}`}>
                {t.tag}
              </div>
              <div className="text-[10px] text-text-muted">{t.count} posts</div>
            </div>
          </button>
        ))}
      </div>

      <Divider className="mb-4" />

      <div>
        <div className="text-[10px] font-bold text-text-muted tracking-[1.2px] uppercase mb-2 pl-0.5">
          Quick Access →
        </div>
        {quickTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              onTagClick(activeTag === tag ? "" : tag);
              onClose?.();
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:text-text-primary ${
              activeTag === tag ? "text-brand" : "text-text-muted"
            }`}
          >
            {tag}
          </button>
        ))}
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