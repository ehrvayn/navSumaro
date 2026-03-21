import React from "react";
import { Avatar, Button } from "../ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { usePage } from "../../context/PageContex";

interface CreatePostBarProps {
  onOpen: () => void;
}

const CreatePostBar: React.FC<CreatePostBarProps> = ({ onOpen }) => {
  const { currentUser } = useCurrentUser();
  const { setActivePage } = usePage();
  if (!currentUser) return null;
  return (
    <div className="bg-base-surface border border-border rounded-2xl p-3 flex items-center gap-3 mb-5 hover:border-orange-500/30 transition-all duration-200">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActivePage("myprofile");
        }}
      >
        <Avatar initials={currentUser.avatar} size="md" />
      </button>
      <button
        onClick={onOpen}
        className="flex-1 text-left bg-base border border-border rounded-md px-4 py-2.5 text-text-muted text-[13px] cursor-pointer hover:border-brand/40 hover:text-text-secondary transition-all duration-150"
      >
        Let's share what's going on your mind...
      </button>
      <Button onClick={onOpen} size="md" className=" hidden sm:flex">
        Post?
      </Button>
    </div>
  );
};

export default CreatePostBar;
