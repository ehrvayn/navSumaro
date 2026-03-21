import React, { useState } from "react";
import { MarketplaceListing } from "../../types";
import ListingCard from "../../components/marketplace/ListingCard";
import { Button } from "../../components/ui";
import Fuse from "fuse.js";
import { useListings } from "../../context/ListingContext";
import {
  Filter,
  ShoppingBag,
  CheckCircle2,
  Users,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useMessages } from "../../context/MessageContext";
import ConversationPage from "../message/ConversationPage";

interface MarketplacePageProps {
  searchQuery: string;
  onListingClick: (listing: MarketplaceListing) => void;
}

const categories = [
  "All",
  "Books",
  "Electronics",
  "Clothing",
  "Notes",
  "Supplies",
  "Other",
];

const MarketplacePage: React.FC<MarketplacePageProps> = ({
  searchQuery,
  onListingClick,
}) => {
  const { setShowCreateListing, listings } = useListings();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSold, setShowSold] = useState(true);

  const { selectedConversation, setSelectedConversation } = useMessages();

  if (selectedConversation) {
    return (
      <ConversationPage
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const fuse = new Fuse(listings, {
    keys: ["title", "description"],
    threshold: 0.4,
  });

  const filtered = (
    searchQuery ? fuse.search(searchQuery).map((r) => r.item) : listings
  ).filter((l) => {
    const matchCategory =
      activeCategory === "All" ||
      l.category === activeCategory.toLocaleLowerCase();
    return matchCategory && (showSold || !l.sold);
  });

  const stats = [
    {
      label: "Active",
      value: listings.filter((l) => !l.sold).length,
      color: "text-emerald-400",
      icon: <ShoppingBag size={12} />,
    },
    {
      label: "Sold",
      value: listings.filter((l) => l.sold).length,
      color: "text-rose-400",
      icon: <CheckCircle2 size={12} />,
    },
    {
      label: "Sellers",
      value: new Set(listings.map((l) => l.seller.id)).size,
      color: "text-sky-400",
      icon: <Users size={12} />,
    },
  ];

  return (
    <div className="w-full min-h-screen px-2 py-6 md:py-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-y-6 gap-x-10 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-md bg-brand/10 flex items-center justify-center text-brand shrink-0">
              <ShoppingCart size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-[17px] md:text-[28px] lg:text-4xl font-black text-text-primary tracking-tight break-words">
              Marketplace
            </h1>
          </div>
          <p className="mt-1 text-text-muted max-w-sm text-[12px] md:text-[13] lg:text-md">
            Safe, verified, and exclusive to your university community.
          </p>
        </div>

        <div className="flex flex-row items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto">
          <div className="hidden sm:flex items-center gap-1 pr-4 md:pr-8 border-r border-border/50">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-baseline gap-1 px-3 py-1 ${i !== stats.length - 1 ? "border-r border-border/30" : ""}`}
              >
                <span
                  className={`text-sm sm:text-md font-black tabular-nums ${s.color}`}
                >
                  {s.value}
                </span>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowCreateListing(true)}
            className="h-11 md:h-12 px-5 md:px-8 rounded-2xl font-bold shadow-xl shadow-brand/20 text-sm whitespace-nowrap flex items-center grow md:grow-0 justify-center transition-transform active:scale-95"
          >
            <Plus size={20} className="mr-2 shrink-0" />
            <span>Create Listing</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 mb-8 sm:hidden">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center p-3 bg-base-surface rounded-md border border-border"
          >
            <div className={`${s.color} mb-1`}>{s.icon}</div>
            <div className="text-sm font-black text-text-primary leading-none">
              {s.value}
            </div>
            <div className="text-[8px] text-text-muted uppercase font-bold tracking-tighter mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky top-0 -mx-4 px-4 bg-base-elevated/80 backdrop-blur-xl border-y border-border/50 py-3 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-2 text-text-muted shrink-0 mr-3">
              <Filter size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Filters
              </span>
            </div>

            <div className="flex-1 py-1 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    activeCategory === cat
                      ? "bg-text-primary text-base-elevated border-text-primary"
                      : "bg-base-surface text-text-muted border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowSold(!showSold)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold border transition-all ${
              showSold
                ? "bg-brand/5 text-brand border-brand/20"
                : "bg-base-surface text-text-muted border-border"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${showSold ? "bg-brand animate-pulse" : "bg-text-muted"}`}
            />
            {showSold ? "Hide Sold Items" : "Show Sold Items"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-border/50 rounded-3xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-base font-bold text-text-primary">
            No listings match your search
          </h3>
          <Button
            variant="ghost"
            className="mt-4 text-brand text-xs"
            onClick={() => {
              setActiveCategory("All");
              setShowSold(true);
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
          {filtered.map((listing, i) => (
            <div
              key={listing.id}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <ListingCard
                listing={listing}
                onClick={() => onListingClick(listing)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
