import React, { createContext, useContext, useState } from "react";
import { MarketplaceListing, Comment } from "../types";
import { mockListings } from "../data/mockListings";
import { mockListComments } from "../data/mockComments";

interface ListingContextType {
  listings: MarketplaceListing[];
  setListings: React.Dispatch<React.SetStateAction<MarketplaceListing[]>>;
  selectedListing: MarketplaceListing | null;
  setSelectedListingId: React.Dispatch<React.SetStateAction<string | null>>;
  showCreateListing: boolean;
  setShowCreateListing: React.Dispatch<React.SetStateAction<boolean>>;
  getFilteredListings: (query: string) => MarketplaceListing[];
  handleListLike: (id: string) => void;
  handleSold: (id: string) => void;
  getComments: (listingId: string) => Comment[];
  addComment: (listingId: string, comment: Comment) => void;
  likeComment: (listingId: string, commentId: string) => void;
}

const ListingContext = createContext<ListingContextType | null>(null);

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<MarketplaceListing[]>(mockListings);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const selectedListing = listings.find((l) => l.id === selectedListingId) || null;

  const initialComments = mockListComments.reduce<Record<string, Comment[]>>((acc, c) => {
    if (!acc[c.postId]) acc[c.postId] = [];
    acc[c.postId].push(c);
    return acc;
  }, {});

  const [listingComments, setListingComments] = useState<Record<string, Comment[]>>(initialComments);

  const getComments = (listingId: string): Comment[] => listingComments[listingId] ?? [];

  const addComment = (listingId: string, comment: Comment) => {
    setListingComments((prev) => ({
      ...prev,
      [listingId]: [comment, ...(prev[listingId] ?? [])],
    }));
  };

  const likeComment = (listingId: string, commentId: string) => {
    setListingComments((prev) => ({
      ...prev,
      [listingId]: (prev[listingId] ?? []).map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c,
      ),
    }));
  };

  const handleSold = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, sold: !l.sold } : l)),
    );
  };

  const handleListLike = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, liked: !l.liked, likes: l.liked ? l.likes - 1 : l.likes + 1 }
          : l,
      ),
    );
  };

  const getFilteredListings = (query: string) =>
    listings.filter(
      (l) =>
        query === "" ||
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.description.toLowerCase().includes(query.toLowerCase()) ||
        l.seller.firstname.toLowerCase().includes(query.toLowerCase()),
    );

  return (
    <ListingContext.Provider
      value={{
        listings,
        setListings,
        selectedListing,
        setSelectedListingId,
        showCreateListing,
        setShowCreateListing,
        getFilteredListings,
        handleListLike,
        handleSold,
        getComments,
        addComment,
        likeComment,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context) throw new Error("useListings must be used inside ListingProvider");
  return context;
};