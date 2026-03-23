import { Group } from "../../../types";
import { Plus, Search, X } from "lucide-react";
import { useGroup } from "../../../context/GroupContex";
import { useState } from "react";

interface GroupLeftSidebarProps {
  activeGroupId: string;
  onGroupSelect: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

function GroupLeftSidebar({
  activeGroupId,
  onGroupSelect,
  isOpen,
  onClose,
}: GroupLeftSidebarProps) {
  const { setShowCreateGroup, groups } = useGroup();
  const [search, setSearch] = useState("");

  const filtered = groups
    .filter((g: Group) => g.joined === true)
    .filter((g: Group) => g.name.toLowerCase().includes(search.toLowerCase()));

  const content = (
    <aside className="w-52 flex-shrink-0 h-full flex mt-[60px] md:mt-0 flex-col gap-2 px-3 border-r border-white/5">
      <button
        onClick={() => setShowCreateGroup(true)}
        className="w-full mt-3 py-2.5 rounded-md border-2 border-dashed border-white/100 text-slate-500 text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/5 transition-all"
      >
        <Plus size={15} />
        Create Group
      </button>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 mb-2">
        My Groups
      </p>
      <div className="flex flex-col gap-1">
        {filtered.map((g: Group) => (
          <button
            key={g.id}
            onClick={() => {
              onGroupSelect(g.id);
              onClose?.();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md transition-all ${
              g.id === activeGroupId
                ? "bg-orange-500/10 border border-orange-500/20"
                : "border border-transparent hover:bg-white/5"
            }`}
          >
            <div
              className={`text-[13px] truncate ${
                g.id === activeGroupId
                  ? "font-semibold text-orange-400"
                  : "font-normal text-slate-400"
              }`}
            >
              {g.name}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              #{g.subject}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-full overflow-y-auto">{content}</div>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 left-0 h-full bg-base-elevated border-r border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 pt-4 pb-2 flex-shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Groups
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

export default GroupLeftSidebar;
