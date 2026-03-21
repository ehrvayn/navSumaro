import React from "react";
import { useCurrentUser } from "../../context/CurrentUserContex";

const uniqueAvatarColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 50%)`;
};

interface AvatarProps {
  initials?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  className?: string;
  isOnline?: boolean;
}

const avatarSizes = {
  xs: "w-5 h-5 text-[9px]",
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = "md",
  color,
  className = "",
  isOnline = false,
}) => {
  const { currentUser } = useCurrentUser();
  const displayInitials = (initials && initials.length > 0)
    ? initials
    : (currentUser?.firstname?.[0] ?? "") + (currentUser?.lastname?.[0] ?? "");
  const backgroundColor = color ?? uniqueAvatarColor(displayInitials);

  return (
    <div className="relative shrink-0">
      <div
        className={`rounded-md flex hover:border-[2px] border-orange-500 items-center justify-center font-bold ${avatarSizes[size]} ${className}`}
        style={{ backgroundColor, color: "#fff" }}
      >
        {displayInitials}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-[#0d1117]" />
      )}
    </div>
  );
};

interface TagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({ label, active, onClick }) => (
  <span
    onClick={onClick}
    className={`tag-pill text-[9px] sm:text-[12px] ${active ? "tag-pill-active" : ""}`}
  >
    {label}
  </span>
);

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: "bg-brand hover:bg-brand-hover text-white",
  secondary:
    "bg-transparent border border-border text-text-secondary hover:bg-base-hover",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-sm",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  fullWidth,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center justify-center gap-1.5 font-semibold rounded-[5px]
      transition-all duration-150 
      ${buttonVariants[variant]} ${buttonSizes[size]}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `}
  >
    {children}
  </button>
);

export const Divider: React.FC<{ className?: string }> = ({
  className = "",
}) => <div className={`h-px bg-border w-full ${className}`} />;

interface StatProps {
  icon: string;
  value: number | string;
}

export const Stat: React.FC<StatProps> = ({ icon, value }) => (
  <span className="inline-flex items-center gap-1 text-text-muted text-xs font-medium">
    <span>{icon}</span>
    <span>{value}</span>
  </span>
);

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  onAction,
}) => (
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs font-bold text-text-secondary tracking-wide uppercase">
      {title}
    </span>
    {action && (
      <button
        onClick={onAction}
        className="text-[11px] text-brand font-semibold hover:underline"
      >
        {action}
      </button>
    )}
  </div>
);