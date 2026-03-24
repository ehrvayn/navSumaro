import React, { useState, useEffect } from "react";
import { MarketplaceListing, Comment, Message } from "../../types";
import { Avatar } from "../../components/ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { useListings } from "../../context/ListingContext";
import { useMessages } from "../../context/MessageContext";
import { usePosts } from "../../context/PostContext";
import { usePage } from "../../context/PageContex";
import ConversationPage from "../message/ConversationPage";
import ListingingCommentThread from "../../components/ui/CommentListingThread";
import { FaCheckCircle } from "react-icons/fa";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  MapPin,
  Tag,
  ArrowLeft,
  SendHorizontal,
  ShoppingBag,
} from "lucide-react";

interface ListingDetailPageProps {
  listing: MarketplaceListing;
  onLike: (id: string) => void;
  onBack: () => void;
  onSold: (id: string) => void;
}

const conditionColor: Record<MarketplaceListing["condition"], string> = {
  "brand-new": "text-green-400 bg-green-500/10 border-green-500/20",
  "like-new": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  good: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  fair: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  used: "text-red-400 bg-red-500/10 border-red-500/20",
};

const TITLE_LIMIT = 80;
const DESC_LIMIT = 200;

const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listing,
  onLike,
  onBack,
  onSold,
}) => {
  const [comment, setComment] = useState("");
  const { getComments, addComment, likeComment, fetchListingComments } =
    useListings();
  const comments = getComments(listing.id);
  const [currentImage, setCurrentImage] = useState(0);
  const [isSold, setIsSold] = useState(listing.sold);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { currentUser } = useCurrentUser();
  const { setActivePage } = usePage();
  const { getUserData } = usePosts();
  if (!currentUser) return null;

  const isTitleLong = listing.title.length > TITLE_LIMIT;
  const isDescLong = (listing.description?.length ?? 0) > DESC_LIMIT;

  const { Messages, setSelectedConversation, selectedConversation } =
    useMessages();

  useEffect(() => {
    fetchListingComments(listing.id);
  }, [listing.id]);

  const timeAgo = (() => {
    const now = new Date();
    const date = new Date(listing.createdAt);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  })();

  const getAuthorInitials = () => {
    if (listing.seller.accountType === "organization") {
      return (listing.seller as any).name?.[0] ?? "";
    }
    return (
      (listing.seller.firstname?.[0] ?? "") +
      (listing.seller.lastname?.[0] ?? "")
    );
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const existingConversation = Messages.find(
      (m) =>
        m.participantId === listing.seller.id ||
        m.participant?.id === listing.seller.id,
    );

    const conversation = (existingConversation ?? {
      id: `new-${listing.seller.id}-${Date.now()}`,
      participantId: listing.seller.id,
      participant: {
        id: listing.seller.id,
        firstname: listing.seller.firstname,
        lastname: listing.seller.lastname,
        avatar: listing.seller.avatar,
        isOnline: false,
        program: listing.seller.program,
        accountType: "student" as const,
      },
      firstname: listing.seller.firstname,
      lastname: listing.seller.lastname,
      avatar: listing.seller.avatar,
      isOnline: false,
      program: listing.seller.program,
      accountType: "student" as const,
    }) as Message;

    setSelectedConversation(conversation);
  };

  if (selectedConversation) {
    return (
      <ConversationPage
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const handleReply = (parentId: string, text: string) => {
    addComment(listing.id, {
      id: "",
      postId: listing.id,
      parentId,
      author: { ...currentUser, isOnline: true },
      text,
      time: "Just now",
      likes: 0,
      liked: false,
    });
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    addComment(listing.id, {
      id: "",
      postId: listing.id,
      parentId: null,
      author: { ...currentUser, isOnline: true },
      text: comment,
      time: "Just now",
      likes: 0,
      liked: false,
    });
    setComment("");
  };

  const handleCommentLike = (id: string) => {
    likeComment(listing.id, id);
  };

  const prevImage = () =>
    setCurrentImage((p) => (p === 0 ? listing.images.length - 1 : p - 1));
  const nextImage = () =>
    setCurrentImage((p) => (p === listing.images.length - 1 ? 0 : p + 1));
  const topLevel = comments.filter(
    (c) => c.parentId === null || (c as any).parent_id === null,
  );
  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-base overflow-hidden">
      <div className="shrink-0 border-b border-border bg-base-surface/50 px-4 md:px-8 py-3 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary text-xs font-semibold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Marketplace</span>
          <span className="text-border mx-1">/</span>
          <span className="text-text-primary truncate max-w-[150px] md:max-w-[300px]">
            {listing.title}
          </span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-base-surface overflow-y-auto lg:overflow-hidden">
        <div className="w-full lg:w-[60%] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-base lg:overflow-y-auto custom-scrollbar">
          <div className="relative aspect-[4/3] md:aspect-video shrink-0 bg-black/40 overflow-hidden isolate">
            {listing.images.length > 0 ? (
              <>
                <img
                  src={listing.images[currentImage]}
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-150 opacity-50"
                  alt=""
                />
                <img
                  src={listing.images[currentImage]}
                  className="relative z-10 w-full h-full object-contain"
                  alt=""
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2">
                <ShoppingBag size={32} className="opacity-30" />
                <span className="text-xs">No images</span>
              </div>
            )}

            {isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none z-20">
                <span className="bg-red-500 text-white text-sm font-black px-6 py-2 rounded-full -rotate-12 shadow-2xl tracking-widest uppercase">
                  Sold
                </span>
              </div>
            )}

            {listing.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="group absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-30 active:scale-90"
                >
                  <div className="border-2 bg-black/60 border-orange-500 rounded-full w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                    <ChevronLeft size={30} className="text-orange-500" />
                  </div>
                </button>
                <button
                  onClick={nextImage}
                  className="group absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-30 active:scale-90"
                >
                  <div className="border-2 bg-black/60 border-orange-500 rounded-full w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                    <ChevronRight size={30} className="text-orange-500" />
                  </div>
                </button>
              </>
            )}
          </div>

          <div className="pt-6 md:pt-10 px-6 md:px-10">
            <div className="flex flex-col sm:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-4">
                <button
                  className=""
                  onClick={(e) => {
                    e.stopPropagation();
                    if (listing.seller.id === currentUser.id) {
                      setActivePage("myprofile");
                    } else {
                      getUserData(listing.seller.id);
                      setActivePage("profile");
                    }
                  }}
                >
                  <Avatar initials={getAuthorInitials()} size="sm" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] sm:text-[14px] font-bold text-text-primary">
                      {listing.seller.firstname}
                    </span>
                    {listing.seller.isVerified && (
                      <FaCheckCircle size={12} className="text-green-500" />
                    )}
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    {listing.seller.university}{" "}
                    <span className="text-[15px]">|</span> {timeAgo}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-5 md:gap-4 px-2 py-2 sm:p-0 bg-base-hover sm:bg-transparent rounded-md">
                <div className="flex items-center gap-4">
                  {listing.seller.id === currentUser.id && (
                    <button
                      onClick={() => {
                        setIsSold((p) => !p);
                        onSold(listing.id);
                      }}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isSold ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-base-hover text-text-muted border-border hover:text-red-400"}`}
                    >
                      {isSold ? "Sold" : "Mark sold"}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 border-l border-border pl-4 sm:border-none sm:pl-0">
                  <button
                    onClick={() => onLike(listing.id)}
                    className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold transition-all ${listing.liked ? "text-brand" : "text-text-muted"}`}
                  >
                    <Heart
                      size={18}
                      fill={listing.liked ? "currentColor" : "none"}
                      className="md:w-5 md:h-5 active:scale-[0.70] transition-transform hover:scale-[1.1]"
                    />
                    <span className="w-2">{listing.likes}</span>
                  </button>
                  <button
                    onClick={handleMessage}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <MessageCircleMore
                      size={18}
                      className="md:w-5 md:h-5 active:scale-[0.70] transition-transform hover:scale-[1.1]"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              {!showFullDesc && (
                <>
                  {isTitleLong && showFullTitle && (
                    <button
                      onClick={() => setShowFullTitle(false)}
                      className="text-brand text-xs font-semibold mb-2 hover:text-orange-400 transition-colors block"
                    >
                      Show less
                    </button>
                  )}
                  <h1
                    className="text-[17px] md:text-[20px] font-black text-text-primary leading-tight"
                    style={
                      !showFullTitle && isTitleLong
                        ? {
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }
                        : undefined
                    }
                  >
                    {listing.title}
                  </h1>
                  {isTitleLong && (
                    <button
                      onClick={() => {
                        setShowFullTitle((v) => !v);
                        setShowFullDesc(false);
                      }}
                      className="text-brand text-xs font-semibold mt-1 mb-2 hover:text-orange-400 transition-colors"
                    >
                      {showFullTitle ? "Show less" : "Show more..."}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-4 mb-8">
              <span className="text-[20px] flex-wrap break-all md:text-[30px] font-black text-brand">
                ₱{listing.price.toLocaleString()}
              </span>
              {listing.condition && (
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${conditionColor[listing.condition]}`}
                >
                  {listing.condition}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-text-muted mb-10">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-brand/60" />
                <span>{listing.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-brand/60" />
                <span className="capitalize">{listing.category}</span>
              </div>
            </div>

            {!showFullTitle && listing.description && (
              <div className="bg-base-elevated border-t border-border -mx-6 md:-mx-10 mt-10">
                <div className="px-6 md:px-10 pt-6 pb-6">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-3">
                    Description
                  </p>
                  {isDescLong && showFullDesc && (
                    <button
                      onClick={() => setShowFullDesc(false)}
                      className="text-brand text-xs font-semibold mb-2 hover:text-orange-400 transition-colors block"
                    >
                      Show less
                    </button>
                  )}
                  <p
                    className="text-[12px] md:text-[15px] text-text-secondary leading-relaxed"
                    style={
                      !showFullDesc && isDescLong
                        ? {
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }
                        : undefined
                    }
                  >
                    {listing.description}
                  </p>
                  {isDescLong && (
                    <button
                      onClick={() => setShowFullDesc((v) => !v)}
                      className="text-brand text-xs font-semibold mt-2 hover:text-orange-400 transition-colors"
                    >
                      {showFullDesc ? "Show less" : "Show more..."}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[40%] flex flex-col min-h-[500px] lg:min-h-0 bg-base-surface">
          <div className="shrink-0 p-6 border-b border-border/50">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              Comments
              <span className="bg-brand/10 text-brand px-2 py-0.5 rounded text-[10px]">
                {comments.length}
              </span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-6 lg:max-h-[calc(100vh-280px)]">
            {topLevel.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                <MessageCircleMore size={32} className="opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-40">
                  No comments yet
                </p>
              </div>
            ) : (
              topLevel.map((c) => (
                <ListingingCommentThread
                  key={c.id}
                  comment={c}
                  comments={comments}
                  onLike={handleCommentLike}
                  onReply={handleReply}
                />
              ))
            )}
          </div>

          <div className="shrink-0 p-6 bg-base-surface border-t border-border">
            <div className="flex items-center gap-3">
              <Avatar initials={getAuthorInitials()} size="sm" />
              <div className="relative flex-1">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  placeholder="Ask a question..."
                  className="w-full bg-base-elevated border border-border rounded-2xl py-3.5 pl-5 pr-12 text-sm focus:border-brand outline-none transition-all"
                />
                <button
                  onClick={submitComment}
                  disabled={!comment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-brand disabled:text-text-muted hover:bg-brand/10 rounded-xl transition-all"
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
