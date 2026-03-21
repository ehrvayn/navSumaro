import { Avatar } from "../../../ui";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useRef, useEffect } from "react";
import { usePage } from "../../../../context/PageContex";
import { useLogin } from "../../../../context/LoginContex";
import { useCurrentUser } from "../../../../context/CurrentUserContex";

interface ProfileMenuProps {
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
}

function ProfileMenu({ profileOpen, setProfileOpen }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { setActivePage } = usePage();
  const { setShowLogout } = useLogin();
  const { currentUser } = useCurrentUser();

  if (!currentUser) return null;
  
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const items = [
    {
      label: "View Profile",
      icon: <User size={14} />,
      onClick: () => {
        setActivePage("myprofile");
        setProfileOpen(false);
      },
    },
    {
      label: "Sign Out",
      icon: <LogOut size={14} />,
      onClick: () => {
        setShowLogout(true);
        setProfileOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 px-2 py-1 bg-base-elevated border border-border rounded-md hover:border-brand"
      >
        <Avatar initials={currentUser.avatar} size="xs" />
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform ${profileOpen ? "rotate-180" : ""}`}
        />
      </button>

      {profileOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-base-elevated border border-border rounded-md p-2 shadow-md z-60 ">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] hover:bg-base-hover ${item.danger ? "text-red-400" : "text-text-secondary"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
