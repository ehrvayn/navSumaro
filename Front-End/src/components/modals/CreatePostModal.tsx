import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Post } from "../../types";
import { Avatar, Button } from "../ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { usePosts } from "../../context/PostContext";
import { HelpCircle, MessageCircle, Paperclip, FlaskConical, Rocket, ArrowRight, X } from "lucide-react";
import { useGroup } from "../../context/GroupContex";

interface CreatePostModalProps {
  onClose: () => void;
  mode?: "global" | "group";
}

const postTypes: { value: Post["type"]; label: string; icon: any; classes: string; }[] = [
  { value: "question", label: "Question", icon: HelpCircle, classes: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { value: "discussion", label: "Discussion", icon: MessageCircle, classes: "bg-green-500/15 text-green-400 border-green-500/30" },
  { value: "resource", label: "Resource", icon: Paperclip, classes: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { value: "research", label: "Research", icon: FlaskConical, classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, mode = "global" }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<Post["type"]>("question");
  const [submitting, setSubmitting] = useState(false);
  const { handleCreatePost } = usePosts();
  const { activeGroupId } = useGroup();
  const { currentUser } = useCurrentUser();

  if (!currentUser) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const getDisplayName = () => {
    if (currentUser.accountType === "organization") return (currentUser as any).name;
    return currentUser.firstname;
  };

  const getDisplayInfo = () => {
    if (currentUser.accountType === "organization") return (currentUser as any).organizationType;
    return currentUser.program;
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(`#${t}`)) {
      setTags([...tags, `#${t}`]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    const data = {
      title,
      body,
      tags: tags.length > 0 ? tags : [],
      type,
      groupId: mode === "group" ? activeGroupId : undefined,
    };
    await handleCreatePost(data);
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border border-border-accent rounded-0 md:rounded-lg md:w-[640px] w-full h-[87vh] md:h-[80vh] md:mt-[60px] mt-[120px] overflow-y-auto animate-scaleIn shadow-2xl"
      >
        <div className="flex justify-between items-center px-5 sm:px-7 py-5 border-b border-border sticky top-0 bg-base-elevated z-10">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Create a Post</h2>
            <p className="text-[11px] text-text-muted">Share with your university community</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-text-muted text-[13px] items-center flex hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors">
            Back<ArrowRight size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-5 flex flex-col gap-5">
          <div className="flex items-center gap-3 p-3 bg-base-surface border border-border rounded-xl">
            <Avatar initials={currentUser.avatar} size="md" />
            <div>
              <div className="text-[13px] font-semibold text-text-primary">{getDisplayName()}</div>
              <div className="text-[10px] text-text-muted">{currentUser.university} · {getDisplayInfo()}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Post Type</span>
            <div className="flex gap-2 flex-wrap">
              {postTypes.map((pt) => {
                const Icon = pt.icon;
                return (
                  <button
                    key={pt.value}
                    onClick={() => setType(pt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all duration-150 cursor-pointer ${
                      type === pt.value ? pt.classes : "bg-base border-border text-text-muted hover:bg-base-hover"
                    }`}
                  >
                    <Icon size={13} />
                    {pt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to ask or share?"
              className="input-base font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add more context or details..."
              rows={7}
              className="input-base resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Tags <span className="normal-case tracking-normal font-normal opacity-50">— optional</span>
            </span>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="e.g. Calculus, StudyTips"
                className="input-base flex-1 text-xs"
              />
              <button onClick={addTag} className="bg-orange-500/10 text-brand border border-orange-500/25 rounded-xl px-3.5 text-xs font-semibold hover:bg-orange-500/20 transition-all">
                + Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-1.5 max-h-[130px] overflow-y-auto flex-wrap mt-1">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-orange-500/15 text-brand px-2.5 py-0.5 rounded-full text-[11px]">
                    {tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="text-brand hover:text-red-400 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 justify-end px-5 sm:px-7 py-5 border-t border-border sticky bottom-0 bg-base-elevated">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || submitting}>
            <span className="flex items-center gap-1.5">
              <Rocket size={14} />
              {submitting ? "Posting..." : "Post"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;