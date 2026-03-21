import {
  User,
  Pencil,
  X,
  Star,
  GraduationCap,
  BookOpen,
  Trophy,
  Check,
  AtSign,
  KeyRound,
  School,
} from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "../context/CurrentUserContex";
import { usePosts } from "../context/PostContext";
import { Post } from "../types";
import Feed from "../components/feed/Feed";
import { jwtDecode } from "jwt-decode";
import { Avatar } from "../components/ui";
import { FaCheckCircle } from "react-icons/fa";

interface JWTPayload {
  id: string;
  email: string;
}

function MyProfilePage() {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const { posts, setSelectedPostId, searchQuery, setShowCreatePost } =
    usePosts();
  const [editing, setEditing] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountDraft, setAccountDraft] = useState({
    email: "",
    password: "",
  });
  const [draft, setDraft] = useState({
    firstname: "",
    lastname: "",
    university: "",
    program: "",
    yearLevel: 0,
  });
  if (!currentUser) return null;

  const handleTagClick = (tag: string) =>
    setActiveTag(tag === activeTag || tag === "" ? null : tag);

  const filtered = posts.filter((p) => p.author?.id === currentUser.id);

  const startEdit = (field: string) => {
    setDraft({
      firstname: currentUser.firstname,
      lastname: currentUser.lastname,
      university: currentUser.university,
      program: currentUser.program,
      yearLevel: currentUser.yearLevel,
    });
    setAccountDraft({
      email: currentUser.email,
      password: "",
    });
    setEditing(field);
  };

  const confirmEdit = async (field: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode<JWTPayload>(token);

      const isAccountField = field in accountDraft;
      const value = isAccountField
        ? accountDraft[field as keyof typeof accountDraft]
        : draft[field as keyof typeof draft];

      const response = await fetch(
        `http://localhost:5000/user/updateUser/${decoded.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: field,
            value1: value,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        updateCurrentUser({ [field]: value });
        setEditing(null);
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setConfirmPassword("");
  };

  const fields: {
    key: keyof typeof draft;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: "firstname", label: "Firstname", icon: <User size={13} /> },
    { key: "lastname", label: "Lastname", icon: <User size={13} /> },
    {
      key: "university",
      label: "University",
      icon: <School size={13} />,
    },
    { key: "program", label: "Program", icon: <BookOpen size={13} /> },
    { key: "yearLevel", label: "yearLevel", icon: <GraduationCap size={13} /> },
  ];

  const accountFields: {
    key: keyof typeof accountDraft;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: "email", label: "Email", icon: <AtSign size={13} /> },
    { key: "password", label: "Password", icon: <KeyRound size={13} /> },
  ];

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto bg-base">
      <div className="max-w-[70%] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[320px] lg:sticky lg:top-6 flex flex-col gap-4 shrink-0">
            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="flex flex-col items-center gap-3 px-6 py-6">
                <Avatar initials={currentUser.avatar} size="md" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <h1 className="text-[14px] font-black text-text-primary">
                      {currentUser.firstname} {currentUser.lastname}
                    </h1>
                    {currentUser.isVerified && (
                      <FaCheckCircle size={15} className="text-green-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {currentUser.program}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {currentUser.university}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  icon: <Trophy size={13} className="text-brand" />,
                  label: "Rep",
                  value: currentUser.reputation,
                },
                {
                  icon: <GraduationCap size={13} className="text-blue-400" />,
                  label: "Year",
                  value: `Yr ${currentUser.yearLevel}`,
                },
                {
                  icon: <Star size={13} className="text-yellow-400" />,
                  label: "Badges",
                  value: currentUser.badges.length.toString(),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-base-elevated border border-border rounded-md p-3 flex flex-col items-center gap-1"
                >
                  {stat.icon}
                  <span className="text-[13px] font-black text-text-primary">
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Account
                </h2>
              </div>
              <div className="divide-y divide-border">
                {accountFields.map(({ key, label, icon }) => (
                  <div key={key} className="px-4 py-3 flex items-center gap-3">
                    <div className="text-text-muted shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-text-muted uppercase tracking-wider font-semibold mb-0.5">
                        {label}
                      </p>
                      {editing === key ? (
                        key === "password" ? (
                          <div className="flex flex-col gap-2">
                            <input
                              autoFocus
                              type="password"
                              value={accountDraft[key]}
                              onChange={(e) =>
                                setAccountDraft((p) => ({
                                  ...p,
                                  [key]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (accountDraft[key] === confirmPassword) {
                                    confirmEdit(key);
                                  } else {
                                    alert("Password not match");
                                  }
                                }
                                if (e.key === "Escape") cancelEdit();
                              }}
                              autoComplete="new-password"
                              className="w-full bg-base border border-brand rounded px-2 py-1 text-xs text-text-primary outline-none"
                            />
                            {editing && (
                              <>
                                <p className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                                  Confirm Password
                                </p>
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  autoComplete="new-password"
                                  className="w-full bg-base border border-brand rounded px-2 py-1 text-xs text-text-primary outline-none"
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <input
                            autoFocus
                            type="text"
                            value={accountDraft[key]}
                            onChange={(e) =>
                              setAccountDraft((p) => ({
                                ...p,
                                [key]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmEdit(key);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoComplete="off"
                            className="w-full bg-base border border-brand rounded px-2 py-1 text-xs text-text-primary outline-none"
                          />
                        )
                      ) : (
                        <p className="text-[12px] text-text-primary truncate">
                          {key === "password"
                            ? "••••••••"
                            : (currentUser[
                                key as keyof typeof currentUser
                              ] as string)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {editing === key ? (
                        <>
                          <button
                            onClick={() => {
                              if (key === "password") {
                                if (accountDraft.password === confirmPassword) {
                                  confirmEdit(key);
                                } else {
                                  alert("Passwords do not match");
                                }
                              } else {
                                confirmEdit(key);
                              }
                            }}
                            className="p-1 rounded text-green-400 hover:bg-green-500/10 transition-colors"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(key)}
                          className="p-1 rounded text-text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Profile Info
                </h2>
              </div>
              <div className="divide-y divide-border">
                {fields.map(({ key, label, icon }) => (
                  <div key={key} className="px-4 py-3 flex items-center gap-3">
                    <div className="text-text-muted shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-text-muted uppercase tracking-wider font-semibold mb-0.5">
                        {label}
                      </p>
                      {editing === key ? (
                        <input
                          autoFocus
                          value={draft[key]}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, [key]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmEdit(key);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="w-full bg-base border border-brand rounded px-2 py-1 text-xs text-text-primary outline-none"
                        />
                      ) : (
                        <p className="text-[12px] text-text-primary truncate">
                          {
                            currentUser[
                              key as keyof typeof currentUser
                            ] as string
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {editing === key ? (
                        <>
                          <button
                            onClick={() => confirmEdit(key)}
                            className="p-1 rounded text-green-400 hover:bg-green-500/10 transition-colors"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(key)}
                          className="p-1 rounded text-text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-base-elevated border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Badges
                </h2>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {currentUser.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      color: badge.color,
                      borderColor: badge.color + "44",
                      backgroundColor: badge.color + "11",
                    }}
                  >
                    <span>{badge.icon}</span>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="px-1 py-1 mb-3 border-b border-border">
              <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Posts · {filtered.length}
              </h2>
            </div>
            <Feed
              showCreatePostCard={true}
              posts={filtered}
              onPostClick={(post: Post) => setSelectedPostId(post.id)}
              onCreatePost={() => setShowCreatePost(true)}
              activeTag={activeTag}
              onTagClick={handleTagClick}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
