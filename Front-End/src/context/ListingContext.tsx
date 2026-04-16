import React, { createContext, useContext, useState, useEffect } from "react";
import { MarketplaceListing, Comment } from "../types";
import api from "../lib/api";

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
  fetchListingComments: (listingId: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

const ListingContext = createContext<ListingContextType | null>(null);

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listingComments, setListingComments] = useState<
    Record<string, Comment[]>
  >({});

  const selectedListing =
    listings.find((l) => l.id === selectedListingId) || null;

  const fetchListings = async (pageNum: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get(`/listing/all?page=${pageNum}&limit=20`);
      const data = res.data.data;

      const mapped: MarketplaceListing[] = data.map((l: any) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        price: parseFloat(l.price),
        condition: l.condition,
        category: l.category,
        sold: l.sold,
        images: l.images ?? [],
        address: l.address,
        seller: {
          id: l.seller.id,
          firstname: l.seller.firstname,
          lastname: l.seller.lastname,
          avatar: l.seller.avatar ?? null,
          program: l.seller.program ?? "",
          university: l.seller.university ?? "",
          isVerified: l.seller.isVerified ?? false,
          isOnline: false,
          accountType: "student",
        },
        createdAt: l.created_at,
        likes: l.likes ?? 0,
        comments: l.comments ?? 0,
        liked: l.liked ?? false,
      }));

      if (mapped.length < 20) setHasMore(false);
      setListings((prev) => (pageNum === 1 ? mapped : [...prev, ...mapped]));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, []);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage);
  };

  const fetchListingComments = async (listingId: string) => {
    try {
      const res = await api.get(`/listing/comment/${listingId}`);
      const normalized = res.data.map((c: any) => ({
        ...c,
        parentId: c.parent_id ?? c.parentId ?? null,
      }));
      setListingComments((prev) => ({ ...prev, [listingId]: normalized }));
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = (listingId: string): Comment[] =>
    listingComments[listingId] ?? [];

  const addComment = async (listingId: string, comment: Comment) => {
    try {
      const res = await api.post("/listing/comment/create", {
        postId: listingId,
        text: comment.text,
        parentId: comment.parentId ?? null,
      });
      const newComment = {
        ...res.data.comment,
        parentId:
          res.data.comment.parent_id ?? res.data.comment.parentId ?? null,
      };
      setListingComments((prev) => ({
        ...prev,
        [listingId]: [newComment, ...(prev[listingId] ?? [])],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const likeComment = async (listingId: string, commentId: string) => {
    try {
      await api.patch(`/listing/comment/like/${commentId}`);
      setListingComments((prev) => ({
        ...prev,
        [listingId]: (prev[listingId] ?? []).map((c) =>
          c.id === commentId
            ? {
                ...c,
                liked: !c.liked,
                likes: c.liked ? c.likes - 1 : c.likes + 1,
              }
            : c,
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSold = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, sold: !l.sold } : l)),
    );
  };

  const handleListLike = async (id: string) => {
    try {
      await api.patch(`/listing/like/${id}`);
      setListings((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                liked: !l.liked,
                likes: l.liked ? l.likes - 1 : l.likes + 1,
              }
            : l,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getFilteredListings = (query: string) =>
    listings.filter(
      (l) =>
        query === "" ||
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.description?.toLowerCase().includes(query.toLowerCase()) ||
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
        fetchListingComments,
        loadMore,
        hasMore,
        loading,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context)
    throw new Error("useListings must be used inside ListingProvider");
  return context;
};
