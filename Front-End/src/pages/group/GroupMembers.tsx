import { GroupMember } from "../../types";
import { Avatar } from "../../components/ui";
import { useState } from "react";
import { EllipsisVertical, User } from "lucide-react";
import { IoMdRemoveCircle } from "react-icons/io";
import { useGroup } from "../../context/GroupContex";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { FaCheckCircle } from "react-icons/fa";

interface GroupMemberProps {
  members: GroupMember[];
}

function GroupMembers({ members }: GroupMemberProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { kickMember, activeGroupId } = useGroup();
  const { currentUser } = useCurrentUser();

  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 py-5">
        {members.map((m) => (
          <div
            key={m.user.id}
            className={`flex justify-between items-center gap-3 bg-white/[0.03] border ${m.user.id === currentUser?.id ? "border-orange-500/50" : "border-white/[0.07]" }  rounded-md p-3 hover:bg-white/5 transition-all`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                initials={
                  (m.user.firstname?.[0] ?? "") + (m.user.lastname?.[0] ?? "")
                }
                size="md"
                isOnline={m.user.isOnline}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[13px] font-semibold text-slate-200 truncate">
                    {m.user.firstname} {m.user.lastname}
                  </span>
                  {m.user.isVerified && (
                    <FaCheckCircle
                      size={12}
                      className="text-green-500 shrink-0"
                    />
                  )}
                  {m.isAdmin && (
                    <span className="text-[9px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                      Leader
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 truncate">
                  {m.user.program}
                </span>
              </div>
            </div>

            {m.user.id !== currentUser?.id && (
              <div className="relative shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === m.user.id ? null : m.user.id);
                  }}
                  className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
                >
                  <EllipsisVertical size={16} />
                </button>

                {openMenuId === m.user.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-1 w-32 bg-base-surface border border-border rounded-md shadow-lg z-50"
                  >
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-primary hover:bg-white/5 transition-colors">
                      <User size={13} />
                      View Profile
                    </button>
                    {currentUser?.id !== m.user.id &&
                      members.find((m) => m.user.id === currentUser?.id)
                        ?.isAdmin && (
                        <button
                          onClick={() => {
                            kickMember(activeGroupId, m.user.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-500 hover:bg-white/5 transition-colors"
                        >
                          <IoMdRemoveCircle size={13} />
                          Kick
                        </button>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupMembers;
