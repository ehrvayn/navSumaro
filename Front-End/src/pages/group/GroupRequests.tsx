import { Avatar } from "../../components/ui";
import { useState } from "react";
import { EllipsisVertical, User, Check, X } from "lucide-react";
import { useGroup } from "../../context/GroupContex";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { FaCheckCircle } from "react-icons/fa";
import { usePosts } from "../../context/PostContext";
import { usePage } from "../../context/PageContex";

function GroupRequests() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { joinRequests, approveJoinRequest, rejectJoinRequest, activeGroupId } =
    useGroup();
  const { currentUser } = useCurrentUser();
  const { setActivePage } = usePage();
  const { getUserData, setPostUserProfileId } = usePosts();

  if (joinRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-sm font-semibold text-text-primary mb-1">
            No join requests yet
          </p>
          <p className="text-xs text-text-muted">
            All pending requests have been resolved
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 py-5">
        {joinRequests.map((request) => (
          <div
            key={request.id}
            className={`flex justify-between items-center gap-3 bg-white/[0.03] border ${request.user_id === currentUser?.id ? "border-orange-500/50" : "border-white/[0.07]"} rounded-md p-3 hover:bg-white/5 transition-all`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                initials={request.firstname?.[0] ?? ""}
                color={request.user_id}
                size="md"
                isOnline={request.isOnline}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[13px] font-semibold text-slate-200 truncate">
                    {request.firstname} {request.lastname}
                  </span>
                  {request.isVerified && (
                    <FaCheckCircle
                      size={12}
                      className="text-green-500 shrink-0"
                    />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 truncate">
                  {request.program}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  approveJoinRequest(activeGroupId, request.user_id);
                }}
                className="p-1.5 rounded-md text-green-500 hover:bg-green-500/10 transition-all"
              >
                <Check size={15} />
              </button>
              <button
                onClick={() => {
                  rejectJoinRequest(activeGroupId, request.user_id);
                }}
                className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-all"
              >
                <X size={15} />
              </button>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      openMenuId === request.user_id ? null : request.user_id,
                    );
                  }}
                  className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
                >
                  <EllipsisVertical size={16} />
                </button>

                {openMenuId === request.user_id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-1 w-32 bg-base-surface border border-border rounded-md shadow-lg z-50"
                  >
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-primary hover:bg-white/5 transition-colors"
                      onClick={() => {
                        setPostUserProfileId(request.user_id);
                        setActivePage("profile");
                        getUserData(request.user_id);
                        setOpenMenuId(null);
                      }}
                    >
                      <User size={13} />
                      View Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupRequests;
