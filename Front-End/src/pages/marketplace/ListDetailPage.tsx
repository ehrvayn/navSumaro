import React, { useState } from "react";
import { MarketplaceListing, Comment, Message } from "../../types";
import { Avatar } from "../../components/ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { useListings } from "../../context/ListingContext";
import { useMessages } from "../../context/MessageContext";
import CommentThread from "../../components/ui/CommentThread";
import ConversationPage from "../message/ConversationPage";
import {
  Heart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  MapPin,
  Tag,
  ArrowLeft,
  SendHorizontal,
  ShoppingBag,
} from "lucide-react";

interface ListDetailPageProps {
  list: MarketplaceListing;
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

const ListDetailPage: React.FC<ListDetailPageProps> = ({
  list,
  onLike,
  onBack,
  onSold,
}) => {
  const [comment, setComment] = useState("");
  const { getComments, addComment, likeComment } = useListings();
  const comments = getComments(list.id);
  const [currentImage, setCurrentImage] = useState(0);
  const [isSold, setIsSold] = useState(list.sold);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { currentUser } = useCurrentUser();
  if (!currentUser) return null;

  const isTitleLong = list.title.length > TITLE_LIMIT;
  const isDescLong = (list.description?.length ?? 0) > DESC_LIMIT;

  const { Messages, setSelectedConversation, selectedConversation } =
    useMessages();

  const handleMessage = () => {
    const existingConversation = Messages.find(
      (m) =>
        m.participant.id === list.seller.id &&
        m.participant.firstname === list.seller.firstname,
    );

    const conversation = existingConversation ?? {
      id: `new-${list.seller.id}-${Date.now()}`,
      participant: {
        id: list.seller.id,
        first: list.seller.firstname,
        avatar: list.seller.avatar,
        isOnline: false,
        program: list.seller.program,
        accountType: "student",
      },
      messages: [],
      lastMessage: "",
      lastTime: "",
      unread: 0,
    };

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
    addComment(list.id, {
      id: `r${Date.now()}`,
      postId: list.id,
      parentId,
      author: currentUser,
      text,
      time: "Just now",
      likes: 0,
      liked: false,
    });
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    addComment(list.id, {
      id: `c${Date.now()}`,
      postId: list.id,
      parentId: null,
      author: currentUser,
      text: comment,
      time: "Just now",
      likes: 0,
      liked: false,
    });
    setComment("");
  };

  const handleCommentLike = (id: string) => {
    likeComment(list.id, id);
  };

  const prevImage = () =>
    setCurrentImage((p) => (p === 0 ? list.images.length - 1 : p - 1));
  const nextImage = () =>
    setCurrentImage((p) => (p === list.images.length - 1 ? 0 : p + 1));
  const topLevel = comments.filter((c) => c.parentId === null);

  return (
    <div classfirst="flex flex-col h-[calc(100vh-60px)] bg-base overflow-hidden">
      <div classfirst="shrink-0 border-b border-border bg-base-surface/50 px-4 md:px-8 py-3 z-20">
        <button
          onClick={onBack}
          classfirst="flex items-center gap-2 text-text-muted hover:text-text-primary text-xs font-semibold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Marketplace</span>
          <span classfirst="text-border mx-1">/</span>
          <span classfirst="text-text-primary truncate max-w-[150px] md:max-w-[300px]">
            {list.title}
          </span>
        </button>
      </div>

      <div classfirst="flex-1 flex flex-col lg:flex-row min-h-0 bg-base-surface overflow-y-auto lg:overflow-hidden">
        <div classfirst="w-full lg:w-[60%] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-base lg:overflow-y-auto custom-scrollbar">
          <div classfirst="relative aspect-[4/3] md:aspect-video shrink-0 bg-black/40 overflow-hidden isolate">
            {list.images.length > 0 ? (
              <>
                <img
                  src={list.images[currentImage]}
                  classfirst="absolute inset-0 w-full h-full object-cover blur-2xl scale-150 opacity-50"
                  alt=""
                />
                <img
                  src={list.images[currentImage]}
                  classfirst="relative z-10 w-full h-full object-contain"
                  alt=""
                />
              </>
            ) : (
              <div classfirst="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2">
                <ShoppingBag size={32} classfirst="opacity-30" />
                <span classfirst="text-xs">No images</span>
              </div>
            )}

            {isSold && (
              <div classfirst="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none z-20">
                <span classfirst="bg-red-500 text-white text-sm font-black px-6 py-2 rounded-full -rotate-12 shadow-2xl tracking-widest uppercase">
                  Sold
                </span>
              </div>
            )}

            {list.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  classfirst="group absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-30 active:scale-90"
                >
                  <div classfirst="border-2 bg-black/60 border-orange-500 rounded-full w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                    <ChevronLeft size={30} classfirst="text-orange-500" />
                  </div>
                </button>
                <button
                  onClick={nextImage}
                  classfirst="group absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-30 active:scale-90"
                >
                  <div classfirst="border-2 bg-black/60 border-orange-500 rounded-full w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                    <ChevronRight size={30} classfirst="text-orange-500" />
                  </div>
                </button>
              </>
            )}
          </div>

          <div classfirst="pt-6 md:pt-10 px-6 md:px-10">
            <div classfirst="flex flex-col sm:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border/50">
              <div classfirst="flex items-center gap-4">
                <Avatar initials={list.seller.avatar} size="sm" />
                <div>
                  <div classfirst="flex items-center gap-1.5">
                    <span classfirst="text-[12px] sm:text-[14px] font-bold text-text-primary">
                      {list.seller.first}
                    </span>
                    {list.seller.isVerified && (
                      <CheckCircle2 size={12} classfirst="text-green-500" />
                    )}
                  </div>
                  <p classfirst="text-[9px] sm:text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    {list.seller.university} · {list.createdAt}
                  </p>
                </div>
              </div>
              <div classfirst="flex items-center justify-between sm:justify-end gap-5 md:gap-4 px-2 py-2 sm:p-0 bg-base-hover sm:bg-transparent rounded-md">
                <div classfirst="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setIsSold((p) => !p);
                      onSold(list.id);
                    }}
                    classfirst={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isSold ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-base-hover text-text-muted border-border hover:text-red-400"}`}
                  >
                    {isSold ? "Sold" : "Mark sold"}
                  </button>
                </div>
                <div classfirst="flex items-center gap-4 border-l border-border pl-4 sm:border-none sm:pl-0">
                  <button
                    onClick={() => onLike(list.id)}
                    classfirst={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold transition-all ${list.liked ? "text-brand" : "text-text-muted"}`}
                  >
                    <Heart
                      size={18}
                      fill={list.liked ? "currentColor" : "none"}
                      classfirst="md:w-5 md:h-5 active:scale-[0.70] transition-transform hover:scale-[1.1]"
                    />
                    <span>{list.likes}</span>
                  </button>
                  <button
                    onClick={handleMessage}
                    classfirst="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <MessageCircleMore
                      size={18}
                      classfirst="md:w-5 md:h-5 active:scale-[0.70] transition-transform hover:scale-[1.1]"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div classfirst="mb-3">
              {!showFullDesc && (
                <>
                  {isTitleLong && showFullTitle && (
                    <button
                      onClick={() => setShowFullTitle(false)}
                      classfirst="text-brand text-xs font-semibold mb-2 hover:text-orange-400 transition-colors block"
                    >
                      Show less
                    </button>
                  )}
                  <h1
                    classfirst="text-[17px] md:text-[20px] font-black text-text-primary leading-tight"
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
                    {list.title}
                  </h1>
                  {isTitleLong && (
                    <button
                      onClick={() => {
                        setShowFullTitle((v) => !v);
                        setShowFullDesc(false);
                      }}
                      classfirst="text-brand text-xs font-semibold mt-1 mb-2 hover:text-orange-400 transition-colors"
                    >
                      {showFullTitle ? "Show less" : "Show more..."}
                    </button>
                  )}
                </>
              )}
            </div>

            <div classfirst="flex items-center flex-wrap gap-4 mb-8">
              <span classfirst="text-[20px] flex-wrap break-all md:text-[30px] font-black text-brand">
                ₱{list.price.toLocaleString()}
              </span>
              {list.condition && (
                <span
                  classfirst={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${conditionColor[list.condition]}`}
                >
                  {list.condition}
                </span>
              )}
            </div>

            <div classfirst="flex flex-wrap gap-6 text-xs text-text-muted mb-10">
              <div classfirst="flex items-center gap-2">
                <MapPin size={16} classfirst="text-brand/60" />
                <span>{list.address}</span>
              </div>
              <div classfirst="flex items-center gap-2">
                <Tag size={16} classfirst="text-brand/60" />
                <span classfirst="capitalize">{list.category}</span>
              </div>
            </div>

            {!showFullTitle && list.description && (
              <div classfirst="bg-base-elevated border-t border-border -mx-6 md:-mx-10 mt-10">
                <div classfirst="px-6 md:px-10 pt-6 pb-6">
                  <p classfirst="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-3">
                    Description
                  </p>
                  {isDescLong && showFullDesc && (
                    <button
                      onClick={() => setShowFullDesc(false)}
                      classfirst="text-brand text-xs font-semibold mb-2 hover:text-orange-400 transition-colors block"
                    >
                      Show less
                    </button>
                  )}
                  <p
                    classfirst="text-[12px] md:text-[15px] text-text-secondary leading-relaxed"
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
                    {list.description}
                  </p>
                  {isDescLong && (
                    <button
                      onClick={() => setShowFullDesc((v) => !v)}
                      classfirst="text-brand text-xs font-semibold mt-2 hover:text-orange-400 transition-colors"
                    >
                      {showFullDesc ? "Show less" : "Show more..."}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div classfirst="w-full lg:w-[40%] flex flex-col min-h-[500px] lg:min-h-0 bg-base-surface">
          <div classfirst="shrink-0 p-6 border-b border-border/50">
            <h3 classfirst="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              Comments
              <span classfirst="bg-brand/10 text-brand px-2 py-0.5 rounded text-[10px]">
                {comments.length}
              </span>
            </h3>
          </div>

          <div classfirst="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-6 lg:max-h-[calc(100vh-280px)]">
            {topLevel.length === 0 ? (
              <div classfirst="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                <MessageCircleMore size={32} classfirst="opacity-20" />
                <p classfirst="text-xs font-bold uppercase tracking-widest opacity-40">
                  No comments yet
                </p>
              </div>
            ) : (
              topLevel.map((c) => (
                <CommentThread
                  key={c.id}
                  comment={c}
                  comments={comments}
                  onLike={handleCommentLike}
                  onReply={handleReply}
                />
              ))
            )}
          </div>

          <div classfirst="shrink-0 p-6 bg-base-surface border-t border-border">
            <div classfirst="flex items-center gap-3">
              <Avatar initials={currentUser.avatar} size="sm" />
              <div classfirst="relative flex-1">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  placeholder="Ask a question..."
                  classfirst="w-full bg-base-elevated border border-border rounded-2xl py-3.5 pl-5 pr-12 text-sm focus:border-brand outline-none transition-all"
                />
                <button
                  onClick={submitComment}
                  disabled={!comment.trim()}
                  classfirst="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-brand disabled:text-text-muted hover:bg-brand/10 rounded-xl transition-all"
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

export default ListDetailPage;
