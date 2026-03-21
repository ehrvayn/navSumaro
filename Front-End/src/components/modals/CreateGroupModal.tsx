import React, { useState, useEffect } from "react";
import { Button } from "../ui";
import { ArrowRight, Rocket, Lock, Globe } from "lucide-react";
import { useGroup } from "../../context/GroupContex";

interface CreateGroupModalProps {
  onClose: () => void;
}

const EMOJIS = ["📚", "🔬", "💻", "🧮", "🎨", "⚗️", "🌍", "🏛️", "📐", "🧠"];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
  const { handleCreateGroup } = useGroup();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [emoji, setEmoji] = useState("📚");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(`#${t}`)) {
      setTags((prev) => [...prev, `#${t}`]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleCreate = () => {
    if (!name.trim()) return;
    handleCreateGroup({
      name,
      description,
      university,
      course,
      subject,
      isPublic,
      tags,
      emoji,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border border-border-accent rounded-0 md:rounded-lg md:w-[640px] w-full h-[87vh] md:h-[90vh] md:mt-[60px] mt-[120px] overflow-y-auto animate-scaleIn shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center px-5 sm:px-7 py-5 border-b border-border sticky top-0 bg-base-elevated z-10">
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Create a Group
            </h2>
            <p className="text-[11px] text-text-muted">
              Connect with other students
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted text-[13px] items-center flex gap-1 hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
          >
            Back
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-5 flex flex-col gap-5 flex-1">
          <div className="flex gap-3 items-start">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Icon
              </span>
              <div className="relative group">
                <button className="w-11 h-11 rounded-xl bg-base-hover border border-border text-xl flex items-center justify-center hover:border-orange-500/50 transition-colors">
                  {emoji}
                </button>
                <div className="absolute top-full left-0 mt-1.5 bg-base-elevated border border-border rounded-xl p-2 grid grid-cols-5 gap-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto z-20 shadow-xl">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center hover:bg-base-hover transition-colors ${emoji === e ? "bg-orange-500/10 ring-1 ring-orange-500/50" : ""}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Group Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Calculus Study Group"
                className="input-base font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about? What will members learn or discuss?"
              rows={4}
              className="input-base resize-none"
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                University{" "}
                <span className="normal-case tracking-normal font-normal opacity-50">
                  — optional
                </span>
              </span>
              <input
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. MIT"
                className="input-base text-xs"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Course{" "}
                <span className="normal-case tracking-normal font-normal opacity-50">
                  — optional
                </span>
              </span>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. CS101"
                className="input-base text-xs"
              />
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Subject{" "}
                <span className="normal-case tracking-normal font-normal opacity-50">
                  — optional
                </span>
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="input-base text-xs"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Privacy
              </span>
              <div className="flex rounded-xl overflow-hidden border border-border">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
                    isPublic
                      ? "bg-orange-500/10 text-orange-400 border-r border-orange-500/20"
                      : "text-text-muted hover:bg-base-hover border-r border-border"
                  }`}
                >
                  <Globe size={12} /> Public
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
                    !isPublic
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-text-muted hover:bg-base-hover"
                  }`}
                >
                  <Lock size={12} /> Private
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Tags{" "}
              <span className="normal-case tracking-normal font-normal opacity-50">
                — optional
              </span>
            </span>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add a tag and press Enter"
                className="input-base flex-1 text-xs"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-text-muted text-xs hover:bg-white/10 transition-all"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 justify-end px-5 sm:px-7 py-5 border-t border-border sticky bottom-0 bg-base-elevated">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            <span className="flex items-center gap-1.5">
              <Rocket size={14} />
              Create Group
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
