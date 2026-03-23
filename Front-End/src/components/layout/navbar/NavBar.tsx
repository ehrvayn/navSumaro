import React, { useState } from "react";
import ProfileMenu from "./profileMenu/ProfileMenu";
import Logo from "../../../assets/img/Logo.png";
import { Page } from "../../../types";
import { useListings } from "../../../context/ListingContext";
import { usePosts } from "../../../context/PostContext";
import { useMessages } from "../../../context/MessageContext";
import { useCurrentUser } from "../../../context/CurrentUserContex";
import {
  Search,
  House,
  CalendarDays,
  Users,
  ShoppingCart,
  X,
  MessageCircleMore,
  Bell,
} from "lucide-react";

interface TopbarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const navItems: { icon: any; label: string; page: Page }[] = [
  { icon: House, label: "Home", page: "home" },
  { icon: Users, label: "Groups", page: "groups" },
  { icon: CalendarDays, label: "Calendar", page: "calendar" },
  { icon: ShoppingCart, label: "Marketplace", page: "marketplace" },
  { icon: Bell, label: "Notifications", page: "notifications" },
  { icon: MessageCircleMore, label: "Messages", page: "messages" },
];

const Topbar: React.FC<TopbarProps> = ({
  activePage,
  onPageChange,
  onSearchChange,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { setShowCreateListing } = useListings();
  const { setShowCreatePost, setSelectedPostId } = usePosts();
  const { totalUnread } = useMessages();
  const { currentUser } = useCurrentUser();
  const filteredNavItems = navItems.filter((item) => {
    if (currentUser?.accountType === "organization") {
      return item.page !== "marketplace" && item.page !== "groups";
    }
    return true;
  });

  return (
    <header className="sticky top-0 z-[999]">
      <div className="bg-base-surface border-b border-border flex items-center px-5 h-[60px]">
        <div
          className="flex items-center gap-5 cursor-pointer"
          onClick={() => onPageChange("home")}
        >
          <div className="flex flex-col leading-none pb-2">
            <div className="font-extrabold text-[15px] text-white tracking-tight">
              <img src={Logo} className="h-full w-[180px]" />
            </div>
            <div className="text-[8px] text-center text-gray-400 tracking-wide">
              One platform. Your entire campus
            </div>
          </div>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 md:flex hidden gap-5 lg:gap-10 xl:gap-20 items-center">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;
            return (
              <div
                key={item.page}
                className={`rounded-lg ${isActive ? "border-2 border-orange-500" : "border-2 border-transparent"}`}
              >
                <button
                  onClick={() => {
                    onPageChange(item.page);
                    setShowCreateListing(false);
                    setShowCreatePost(false);
                    setSelectedPostId(null);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? "text-orange-500"
                      : "text-text-muted hover:bg-base-hover"
                  }`}
                >
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.page === "messages" && totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full text-[9px] text-white flex items-center justify-center">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        {isSearchExpanded && (
          <div className="absolute inset-x-0 mx-4 flex items-center z-50">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3 text-text-muted pointer-events-none">
                <Search size={16} />
              </span>
              <input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.value === "" && onSearchChange("");
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && onSearchChange(inputValue)
                }
                placeholder="Search..."
                className="w-full bg-base border border-border rounded-md pl-10 pr-10 py-2 text-text-primary text-[13px] outline-none focus:border-brand transition-all"
              />
              <button
                onClick={() => {
                  setInputValue("");
                  onSearchChange("");
                  setIsSearchExpanded(false);
                }}
                className="absolute right-3 text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div
          className={`flex items-center gap-1.5 ml-auto z-10 ${isSearchExpanded ? "hidden" : "flex"}`}
        >
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:bg-base-hover"
          >
            <Search size={20} />
          </button>

          <div className="w-full max-w-[400px] px-4 hidden lg:block">
            <div className="relative flex items-center justify-end">
              <span className="absolute left-16 xl:left-3 text-text-muted pointer-events-none">
                <Search size={16} />
              </span>
              <input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.value === "" && onSearchChange("");
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && onSearchChange(inputValue)
                }
                placeholder="Search..."
                className="bg-base border w-[80%] xl:w-full border-border rounded-md pl-10 pr-10 py-2 text-text-primary text-[13px] outline-none focus:border-brand transition-all"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue("");
                    onSearchChange("");
                  }}
                  className="absolute right-3 text-text-muted hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <ProfileMenu
            setProfileOpen={setProfileOpen}
            profileOpen={profileOpen}
          />
        </div>
      </div>

      <div className="bg-base-surface border-b md:hidden border-border flex px-5 h-[60px]">
        <div className="flex w-full justify-between items-center gap-1.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;
            return (
              <div
                key={item.page}
                className={`rounded-lg ${isActive ? "border-2 border-orange-500" : "border-2 border-transparent"}`}
              >
                <button
                  onClick={() => {
                    onPageChange(item.page);
                    setShowCreateListing(false);
                    setShowCreatePost(false);
                    setSelectedPostId(null);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? "text-orange-500"
                      : "text-text-muted hover:bg-base-hover"
                  }`}
                >
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.page === "messages" && totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full text-[9px] text-white flex items-center justify-center">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
