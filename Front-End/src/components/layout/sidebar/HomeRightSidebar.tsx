import React from "react";
import { mockEvents } from "../../../data/mockEvents";
import { mockOrganizations } from "../../../data/mockOrganization";
import { trendingTopics } from "../../../data/mockData";
import { Divider, SectionHeader } from "../../ui";
import { X } from "lucide-react";
import { usePage } from "../../../context/PageContex";

interface RightSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const { setActivePage } = usePage();

  const content = (
    <div className="pt-5">
      <section className="mb-6">
        <SectionHeader
          title="Campus Events"
          action="View all →"
          onAction={() => setActivePage("calendar")}
        />
        <div className="flex flex-col gap-2">
          {mockEvents.slice(0, 5).map((event) => {
            const org = mockOrganizations.find(
              (o) => o.id === event.organizerId,
            );
            return (
              <div
                key={event.id}
                className="bg-base-surface border border-border rounded-md p-3 flex items-center gap-3 cursor-pointer hover:border-brand/40 transition-all duration-150"
              >
                <div
                  className="min-w-[42px] h-[42px] rounded-md flex flex-col items-center justify-center text-[9px] font-extrabold leading-tight tracking-wide flex-shrink-0"
                  style={{
                    background: `${event.color}22`,
                    border: `1px solid ${event.color}44`,
                    color: event.color,
                  }}
                >
                  <span>{event.month}</span>
                  <span className="text-[13px]">{event.day}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text-primary leading-snug">
                    {event.title}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5 truncate">
                    🔵 {org?.name ?? "Unknown Organization"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Divider className="mb-5" />

      <section className="mb-6">
        <SectionHeader title="Trending Topics" action="See all →" />
        <div className="flex flex-col">
          {trendingTopics.map((topic, i) => (
            <div
              key={topic.id}
              className={`px-2 py-2.5 rounded-md cursor-pointer transition-all duration-150 hover:bg-base-hover hover:pl-3 ${
                i < trendingTopics.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="text-xs font-medium text-text-primary leading-snug mb-1">
                {topic.title}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-text-muted">
                  by {topic.by}
                </span>
                <span className="text-[10px] text-text-muted">
                  👁 {(topic.views / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider className="mb-5" />
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-[60px] shrink-0 overflow-y-auto h-[calc(100vh-60px)]">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-base-elevated border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-base-elevated z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Discover
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
              >
                <X size={15} />
              </button>
            </div>
            <div className="px-4">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default RightSidebar;
