import { Group } from "../../../types";
import { Plus, X, Users } from "lucide-react";
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

  const joined = groups.filter((g: Group) => g.joined === true);

  const content = (
    <aside className="w-56 flex-shrink-0 h-full md:mt-0 mt-16 flex flex-col py-4 px-3 border-r border-border">
      <button
        onClick={() => setShowCreateGroup(true)}
        className="w-full mb-6 px-4 py-2.5 rounded-md bg-brand text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95"
      >
        <Plus size={18} />
        Create Group
      </button>

      <div className="space-y-1 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2 mb-3">
          Groups ({joined.length})
        </p>

        {joined.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users size={28} className="text-text-muted/40 mb-2" />
            <p className="text-xs text-text-muted">No groups joined</p>
          </div>
        ) : (
          joined.map((g: Group) => (
            <button
              key={g.id}
              onClick={() => {
                onGroupSelect(g.id);
                onClose?.();
              }}
              className={`w-full text-left px-2.5 py-2 rounded transition-all ${
                g.id === activeGroupId
                  ? "bg-orange-500/15 border border-orange-500/30"
                  : "border border-transparent hover:bg-base-hover"
              }`}
            >
              <p
                className={`text-sm font-medium truncate ${g.id === activeGroupId ? "text-brand" : "text-text-primary"}`}
              >
                {g.name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Users size={12} className="text-text-muted/60" />
                <p className="text-[10px] text-text-muted">
                  {g.members?.length || 0} members
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-full overflow-hidden">{content}</div>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 left-0 h-full bg-base-elevated border-r border-border z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0 border-b border-border">
              <h2 className="text-sm font-bold text-text-primary">My Groups</h2>
              <button
                onClick={onClose}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-all"
              >
                <X size={16} />
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
