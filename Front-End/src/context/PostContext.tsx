import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Post, Comment } from "../types";
import { useCurrentUser } from "./CurrentUserContex";

interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface Draft {
  id: string;
  firstname: string;
  lastname: string;
  university: string;
  program: string;
  yearLevel: number;
  isVerified: boolean;
  reputation: number;
  badges: Badge[];
  avatar: string;
}

interface PostContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  selectedPost: Post | null;
  selectedPostId: string | null;
  setSelectedPostId: React.Dispatch<React.SetStateAction<string | null>>;
  postUserProfileId: string | null;
  setPostUserProfileId: React.Dispatch<React.SetStateAction<string | null>>;
  deletedPostId: string | null;
  setDeletedPostId: React.Dispatch<React.SetStateAction<string | null>>;
  editPostId: string | null;
  setEditPostId: React.Dispatch<React.SetStateAction<string | null>>;
  showCreatePost: boolean;
  setShowDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  showDeletePost: boolean;
  setShowCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  handleVote: (id: string, type: "up" | "down") => void;
  getFilteredPosts: (query: string) => Post[];
  getGroupPosts: (groupId: string) => Promise<void>;
  getGroupPostsById: (groupId: string) => Post[];
  updatePostInState: (updatedPost: Post) => void;
  getUserData: (userId: string) => Promise<void>;
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  handleCreatePost: (
    data: Omit<
      Post,
      | "id"
      | "createdAt"
      | "author"
      | "votes"
      | "upVote"
      | "downVote"
      | "views"
      | "comments"
    >,
  ) => void;
  handleDeletePost: (id: string) => void;
  getComments: (postId: string) => Comment[];
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string, parentId?: string | null) => void;
  likeComment: (postId: string, commentId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  votePostId: string | null;
  setVotePostId: React.Dispatch<React.SetStateAction<string | null>>;
}

const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [postUserProfileId, setPostUserProfileId] = useState<string | null>(
    null,
  );
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [votePostId, setVotePostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(
    {},
  );
  const [groupPosts, setGroupPosts] = useState<Record<string, Post[]>>({});
  const selectedPost =
    posts.find((p) => p.id === selectedPostId) ||
    Object.values(groupPosts)
      .flat()
      .find((p) => p.id === selectedPostId) ||
    null;
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useCurrentUser();
  const votingRef = useRef<Set<string>>(new Set());
  const [draft, setDraft] = useState<Draft>({
    id: "",
    firstname: "",
    lastname: "",
    university: "",
    program: "",
    yearLevel: 0,
    isVerified: false,
    reputation: 0,
    badges: [],
    avatar: "",
  });

  useEffect(() => {
    getAllPost();
  }, [currentUser]);

  const getAllPost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/post/retrieveAll", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const normalized = data.map((p: any) => ({
          ...p,
          upVote: p.upVote === true,
          downVote: p.downVote === true,
        }));
        setPosts(normalized);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const normalizeComment = (c: any): Comment => ({
    id: c.id,
    postId: c.post_id,
    parentId: c.parent_id ?? null,
    text: c.text,
    time: c.created_at ?? c.time ?? new Date().toISOString(),
    likes: c.likes ?? 0,
    liked: c.liked === true,
    author: {
      id: c.author.id,
      firstname: c.author.firstname,
      lastname: c.author.lastname,
      avatar: (c.author.firstname?.[0] ?? "") + (c.author.lastname?.[0] ?? ""),
      program: c.author.program,
      accountType: c.author.accountType,
      isOnline: false,
      isVerified: c.author.isVerified,
    },
  });

  const getComments = (postId: string): Comment[] => postComments[postId] ?? [];

  const fetchComments = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/post/comment/retrieve/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setPostComments((prev) => ({
          ...prev,
          [postId]: data.map(normalizeComment),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findPostById = (id: string): Post | undefined => {
    return (
      posts.find((p) => p.id === id) ||
      Object.values(groupPosts)
        .flat()
        .find((p) => p.id === id)
    );
  };

  const addComment = async (
    postId: string,
    text: string,
    parentId: string | null = null,
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/post/comment/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, postId, parentId }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setPostComments((prev) => ({
          ...prev,
          [postId]: [normalizeComment(data.comment), ...(prev[postId] ?? [])],
        }));

        const post = findPostById(postId);
        if (post) {
          updatePostInState({
            ...post,
            comments: post.comments + 1,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeComment = async (postId: string, commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/post/comment/like/${commentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setPostComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? []).map((c) =>
            c.id === commentId
              ? { ...c, liked: data.comment.liked, likes: data.comment.likes }
              : c,
          ),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatePost = async (data: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/post/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          body: data.body,
          tags: data.tags,
          type: data.type,
          groupId: data.groupId,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        const newPost = {
          ...result.post,
          author: currentUser,
          upVote: false,
          downVote: false,
        };
        if (data.groupId) {
          setGroupPosts((prev) => ({
            ...prev,
            [data.groupId]: [newPost, ...(prev[data.groupId] ?? [])],
          }));
        } else {
          setPosts((prev) => [newPost, ...prev]);
        }
        setShowCreatePost(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/post/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setGroupPosts((prev) => {
          const updated = { ...prev };
          for (const key in updated) {
            updated[key] = updated[key].filter((p) => p.id !== id);
          }
          return updated;
        });
        setShowDeletePost(false);
        setDeletedPostId(null);
      } else {
        alert(data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const updatePostInState = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
    );
    setGroupPosts((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        updated[key] = updated[key].map((p) =>
          p.id === updatedPost.id ? { ...p, ...updatedPost } : p,
        );
      }
      return updated;
    });
  };

  const handleVote = async (id: string, type: "up" | "down") => {
    if (votingRef.current.has(id)) return;
    votingRef.current.add(id);

    const token = localStorage.getItem("token");
    if (!token) {
      votingRef.current.delete(id);
      return;
    }

    const updateVoteOptimistic = (prev: Post[]) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const alreadyUp = p.upVote === true;
        const alreadyDown = p.downVote === true;
        if (type === "up") {
          const toggling = alreadyUp;
          return {
            ...p,
            upVote: !toggling,
            downVote: false,
            votes: toggling
              ? p.votes - 1
              : alreadyDown
                ? p.votes + 2
                : p.votes + 1,
          };
        } else {
          const toggling = alreadyDown;
          return {
            ...p,
            downVote: !toggling,
            upVote: false,
            votes: toggling
              ? p.votes + 1
              : alreadyUp
                ? p.votes - 2
                : p.votes - 1,
          };
        }
      });

    setPosts(updateVoteOptimistic);
    setGroupPosts((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        updated[key] = updateVoteOptimistic(updated[key]);
      }
      return updated;
    });

    try {
      const response = await fetch(`http://localhost:5000/post/vote/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });
      if (response.ok) {
        const data = await response.json();
        const reconcile = (prev: Post[]) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  votes: data.post.votes,
                  upVote: data.post.userVote === "up",
                  downVote: data.post.userVote === "down",
                }
              : p,
          );
        setPosts(reconcile);
        setGroupPosts((prev) => {
          const updated = { ...prev };
          for (const key in updated) {
            updated[key] = reconcile(updated[key]);
          }
          return updated;
        });
      } else {
        await getAllPost();
      }
    } catch (error) {
      console.log(error);
      await getAllPost();
    } finally {
      votingRef.current.delete(id);
    }
  };

  const getFilteredPosts = (query: string) =>
    posts
      .filter((p) => !p.groupId)
      .filter((p) => {
        const lowerQuery = query.toLowerCase();
        if (!p.author) return false;
        const authorMatch =
          p.author.accountType === "student"
            ? p.author.firstname?.toLowerCase().includes(lowerQuery) ||
              p.author.lastname?.toLowerCase().includes(lowerQuery)
            : (p.author as any).name?.toLowerCase().includes(lowerQuery);
        return (
          query === "" ||
          p.title.toLowerCase().includes(lowerQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
          authorMatch
        );
      });

  const getGroupPosts = async (groupId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:5000/post/retrieveAll?groupId=${groupId}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        const normalized = data.map((p: any) => ({
          ...p,
          upVote: p.upVote === true,
          downVote: p.downVote === true,
        }));
        setGroupPosts((prev) => ({ ...prev, [groupId]: normalized }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/user/retrieve/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Beare ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setDraft({
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          university: data.university,
          program: data.program,
          yearLevel: data.yearLevel,
          isVerified: data.isVerified,
          reputation: data.reputation,
          badges: data.badges,
          avatar: data.avatar,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGroupPostsById = (groupId: string): Post[] =>
    groupPosts[groupId] ?? [];

  return (
    <PostContext.Provider
      value={{
        getUserData,
        postUserProfileId,
        setPostUserProfileId,
        votePostId,
        setVotePostId,
        editPostId,
        setEditPostId,
        isEditing,
        setIsEditing,
        handleDeletePost,
        handleCreatePost,
        posts,
        setPosts,
        selectedPost,
        deletedPostId,
        setDeletedPostId,
        selectedPostId,
        setSelectedPostId,
        showCreatePost,
        setShowCreatePost,
        showDeletePost,
        setShowDeletePost,
        handleVote,
        getFilteredPosts,
        getGroupPosts,
        getGroupPostsById,
        updatePostInState,
        getComments,
        fetchComments,
        addComment,
        likeComment,
        searchQuery,
        setSearchQuery,
        draft,
        setDraft,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used inside PostProvider");
  return context;
};
