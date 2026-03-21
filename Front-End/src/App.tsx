import "./styles/globals.css";
import React from "react";
import Topbar from "./components/layout/navbar/NavBar";
import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import CreatePostModal from "./components/modals/CreatePostModal";
import PostDetailModal from "./components/modals/PostDetailModal";
import CreateListModal from "./components/modals/CreateListModal";
import MessagesPage from "./pages/message/MessagesPage";
import NotificationsPage from "./pages/NotificationPage";
import ListDetailPage from "./pages/marketplace/ListDetailPage";
import GroupStudyPage from "./pages/group/GroupStudyPage";
import CreateGroupModal from "./components/modals/CreateGroupModal";
import CalendarPage from "./pages/event/EventCalendarPage";
import AddEventModal from "./components/modals/AddEventModal";
import LoginPage from "./pages/LoginPage";
import MyProfilePage from "./pages/MyProfilePage";
import LogoutModal from "./components/modals/LogoutModal";
import DeletePostModal from "./components/modals/DeletePostModal";
import EditPostModal from "./components/modals/EditPostModal";
import ProfilePage from "./pages/ProfilePage";
import { useLogin } from "./context/LoginContex";
import { useEvent } from "./context/EventContex";
import { usePage } from "./context/PageContex";
import { useMessages } from "./context/MessageContext";
import { usePosts } from "./context/PostContext";
import { useListings } from "./context/ListingContext";
import { useGroup } from "./context/GroupContex";
import { useCurrentUser } from "./context/CurrentUserContex";

const App: React.FC = () => {
  const { isLoading, currentUser } = useCurrentUser();
  const { activePage, setActivePage } = usePage();
  const { showLogout, setShowLogout } = useLogin();

  const {
    showCreatePost,
    setShowCreatePost,
    selectedPost,
    setSelectedPostId,
    searchQuery,
    setSearchQuery,
    showDeletePost,
    setShowDeletePost,
    isEditing,
    setIsEditing,
    editPostId,
  } = usePosts();

  const { showCreateGroup, setShowCreateGroup } = useGroup();

  const {
    selectedListing,
    setSelectedListingId,
    handleListLike,
    showCreateListing,
    setShowCreateListing,
    handleSold,
  } = useListings();

  const { showCreateEvent, setShowCreateEvent } = useEvent();
  const { setSelectedConversation } = useMessages();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const handlePageChange = (page: any) => {
    setActivePage(page);
    setSearchQuery("");
    if (page !== "messages") setSelectedConversation(null);
    if (page !== "listDetail") setSelectedListingId(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <HomePage />;
      case "marketplace":
        return (
          <MarketplacePage
            searchQuery={searchQuery}
            onListingClick={(listing) => {
              setSelectedListingId(listing.id);
              setActivePage("listDetail");
            }}
          />
        );
      case "listDetail":
        return selectedListing ? (
          <ListDetailPage
            list={selectedListing}
            onLike={handleListLike}
            onSold={handleSold}
            onBack={() => setActivePage("marketplace")}
          />
        ) : null;
      case "calendar":
        return <CalendarPage />;
      case "groups":
        return <GroupStudyPage />;
      case "myprofile":
        return <MyProfilePage />;
      case "profile":
        return <ProfilePage />;
      case "messages":
        return <MessagesPage />;
      case "notifications":
        return <NotificationsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-base font-sora min-h-screen">
      <Topbar
        activePage={activePage}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>{renderPage()}</main>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          mode={activePage === "groups" ? "group" : "global"}
        />
      )}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPostId(null)}
        />
      )}
      {showCreateListing && (
        <CreateListModal onClose={() => setShowCreateListing(false)} />
      )}
      {showCreateEvent && (
        <AddEventModal onClose={() => setShowCreateEvent(false)} />
      )}
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
      {showDeletePost && (
        <DeletePostModal onClose={() => setShowDeletePost(false)} />
      )}
      {isEditing && (
        <EditPostModal
          onClose={() => setIsEditing(false)}
          mode={activePage === "groups" ? "group" : "global"}
        />
      )}
    </div>
  );
};

export default App;
