import React from "react";
import { X } from "lucide-react";
import { Avatar } from "../../ui";
import { SectionHeader } from "../../ui";
import { usePage } from "../../../context/PageContex";
import { mockEvents } from "../../../data/mockEvents";
import { mockOrganizations } from "../../../data/mockOrganization";
import { Group, GroupMember } from "../../../types/index";

interface GroupRightSidebarProps {
  onlineMembers: GroupMember[];
  activeGroup: Group | null;
  handleTagClick: (tag: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

function GroupRightSidebar({
  onlineMembers,
  activeGroup,
  handleTagClick,
  isOpen,
  onClose,
}: GroupRightSidebarProps) {
  const { setActivePage } = usePage();

  const content = (
    <aside className="w-60 flex-shrink-0 px-4 py-5 border-l mt-[60px] md:mt-0 border-white/5">
      <div className="mb-8">
        <SectionHeader
          title="Campus Events"
          action="View all →"
          onAction={() => setActivePage("calendar")}
        />
        <div className="flex flex-col gap-3 mt-4">
          {mockEvents.slice(0, 5).map((e) => {
            const org = mockOrganizations.find((o) => o.id === e.organizerId);
            return (
              <div
                key={e.id}
                className="bg-base-surface border border-border rounded-md p-3 flex items-center gap-3 cursor-pointer hover:border-brand/40 transition-all duration-150"
              >
                <div
                  className="min-w-[42px] h-[42px] rounded-md flex flex-col items-center justify-center text-[9px] font-extrabold leading-tight tracking-wide flex-shrink-0"
                  style={{
                    background: `${e.color}22`,
                    border: `1px solid ${e.color}44`,
                    color: e.color,
                  }}
                >
                  <span>{e.month}</span>
                  <span className="text-[13px]">{e.day}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-slate-200 truncate">
                    {e.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {org?.name ?? "Unknown Organization"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Online
          </p>
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold text-green-400">
              {onlineMembers.length}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {onlineMembers.map((m) => (
            <div key={m.user.id} className="flex items-center gap-2.5">
              <Avatar initials={m.user.avatar} size="sm" isOnline={true} />
              <div className="min-w-0">
                <div className="text-[13px] text-slate-200 font-medium truncate">
                  {m.user.firstname}
                  {m.user.lastname}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {m.user.program?.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Group Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {activeGroup?.tags?.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-[11px] text-slate-500 bg-white/5 border border-white/[0.07] px-2.5 py-1 rounded-full hover:text-slate-300 hover:bg-white/10 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden xl:block h-full overflow-y-auto">{content}</div>

      {isOpen && (
        <div className="fixed inset-0 z-40 xl:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-base-elevated border-l border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-5 pb-2 flex-shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Info
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
              >
                <X size={15} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupRightSidebar;
