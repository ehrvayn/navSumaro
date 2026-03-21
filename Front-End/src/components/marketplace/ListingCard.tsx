import React from "react";
import { MarketplaceListing } from "../../types";
import { Avatar, Button } from "../ui";
import { MessageCircleMore } from "lucide-react";
import { useMessages } from "../../context/MessageContext";
import { CheckCircle2 } from "lucide-react";

interface ListingCardProps {
  listing: MarketplaceListing;
  onClick: (id: string) => void;
}

const conditionConfig: Record<
  MarketplaceListing["condition"],
  { label: string; color: string }
> = {
  "brand-new": { label: "Brand New", color: "#22c55e" },
  "like-new": { label: "Like New", color: "#3b82f6" },
  good: { label: "Good", color: "#eab308" },
  fair: { label: "Fair", color: "#f97316" },
  used: { label: "Used", color: "#ef4444" },
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const cond = conditionConfig[listing.condition];
  const { Messages, setSelectedConversation } = useMessages();

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const existingConversation = Messages.find(
      (m) =>
        m.participant.id === listing.seller.id &&
        m.participant.firstname === listing.seller.firstname,
    );

    const conversation = existingConversation ?? {
      id: `new-${listing.seller.id}-${Date.now()}`,
      participant: {
        id: listing.seller.id,
        firstname: listing.seller.firstname,
        lastname: listing.seller.lastname,
        avatar: listing.seller.avatar,
        isOnline: false,
        program: listing.seller.program,
        accountType: "student",
      },
      messages: [],
      lastMessage: "",
      lastTime: "",
      unread: 0,
    };

    setSelectedConversation(conversation);
  };

  return (
    <div className="relative">
      <div
        onClick={() => onClick(listing.id)}
        className={`bg-base-surface border border-border rounded-md overflow-hidden transition-all duration-200 ${listing.sold ? "opacity-50" : "hover:border-orange-500/40 hover:shadow-brand cursor-pointer"} relative`}
      >
        <div className="h-[130px] bg-base-elevated flex items-center justify-center text-5xl border-b border-border relative">
          <img src={listing.images[0]} className="w-full h-full object-cover" />
        </div>

        <div className="p-3.5">
          <h3 className="text-xs font-semibold text-text-primary leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
            {listing.title}
          </h3>

          <div className="mb-3">
            <CheckCircle2 size={15} className="text-green-400" />
          </div>

          <div className="text-[15px] md:text-[20px] font-extrabold text-brand mb-3">
            ₱{listing.price.toLocaleString()}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Avatar
              initials={listing.seller.avatar}
              size="xs"
              color="#2a3050"
            />
            <div className="flex flex-col flex-wrap min-w-0">
              <div className="flex gap-2 items-center">
                <span className="text-[9px] sm:text-[11px] font-bold text-text-primary truncate">
                  {listing.seller.firstname}
                </span>
                {listing.seller.isVerified && (
                  <span className="text-[9px] text-green-400 font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold text-text-muted truncate">{`(${listing.seller.program})`}</span>
            </div>
          </div>

          <Button
            className={`hover:bg-gray-500 text-[7px] md:text-[12px] active:scale-[0.75] ${listing.sold && "invisible"}`}
            fullWidth
            onClick={handleMessage}
            size="sm"
          >
            <MessageCircleMore size={18} /> Message Seller
          </Button>
        </div>
      </div>

      {listing.sold && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full -rotate-12">
            SOLD
          </span>
        </div>
      )}

      <div className="absolute top-2.5 right-2.5 bg-base-elevated border border-border rounded-full px-2 py-0.5 text-[10px] text-text-muted">
        {listing.createdAt}
      </div>
    </div>
  );
};

export default ListingCard;
