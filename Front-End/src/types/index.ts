export interface User {
  id: string;
  accountType: "student" | "organization";
  firstname: string;
  lastname: string;
  avatar: string;
  university: string;
  program: string;
  yearLevel: number;
  reputation: number;
  isVerified: boolean;
  badges: Badge[];
  email: string;
  password: string;
}

export interface Organization {
  id: string;
  accountType: "organization";
  name: string;
  avatar: string;
  coverPhoto?: string;
  university: string;
  organizationType: "student-org" | "department" | "institution";
  verificationStatus: "pending" | "approved" | "rejected";
  verificationDocuments: string[];
  representative: OrganizationRepresentative;
  description?: string;
  email: string;
  password: string;
  isVerified: boolean;
  badges: Badge[];
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface OrganizationRepresentative {
  name: string;
  position: string;
  email: string;
}

export type AccountOwner = User | Organization;

export const isOrganization = (
  account: AccountOwner,
): account is Organization => {
  return account.accountType === "organization";
};

export const isStudent = (account: AccountOwner): account is User => {
  return account.accountType === "student";
};


export interface Post {
  id: string;
  groupId?: string;
  title: string;
  body?: string;
  tags: string[];
  author: AccountOwner;
  createdAt: string;
  views: number;
  votes: number;
  upVote: boolean;
  downVote: boolean;
  comments: number;
  type: "question" | "discussion" | "resource" | "research" | "announcement"; 
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: "brand-new" | "like-new" | "good" | "fair" | "used";
  category:
    | "books"
    | "electronics"
    | "clothing"
    | "notes"
    | "supplies"
    | "other";
  seller: User;
  createdAt: string;
  likes: number;
  comments: number;
  liked: boolean;
  sold: boolean;
  images: string[];
  address: string;
}

export interface Event {
  id: string;
  title: string;
  month: string;
  day: number;
  organizerId: string;
  color: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime?: string;
  createdAt: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  by: string;
  views: number;
}

export type Page =
  | "home"
  | "marketplace"
  | "calendar"
  | "groups"
  | "profile"
  | "myprofile"
  | "organization"
  | "messages"
  | "notifications"
  | "listDetail"
  | "adminReview"
  | "login";

export interface UserPreview {
  id: string;
  firstname: string;
  lastname: string;
  avatar: string;
  isOnline: boolean;
  program: string;
  isVerified: boolean;
  accountType: "student" | "organization";
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  author: UserPreview;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
}

export interface Conversation {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  seen: boolean;
  senderId: string;
}

export interface Message {
  id: string;
  participantId: string;
  participant: UserPreview;
  messages: Conversation[];
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface GroupConversation {
  id: string;
  title: string;
  avatar: string | string[]; 
  participants: GroupMember[];
  messages: GroupMessage[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  isGroup: boolean;
  adminId: string;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  firstname: string;
  lastname: string;
  senderAvatar: string;
  text: string;
  time: string;
  seenBy: string[]; 
}

export interface Notification {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  seen: boolean;
  type:
    | "like"
    | "comment"
    | "reply"
    | "mention"
    | "follow"
    | "message"
    | "system"
    | "org-verified"
    | "org-rejected"
    | "org-announcement";
  targetId: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  subject: string;
  university: string;
  course: string;
  postCount: number;
  isPublic: boolean;
  joined: boolean;
  tags: string[];
  emoji: string;
  managedBy?: Organization;
  members: GroupMember[];
}

export interface GroupMember {
  user: UserPreview;
  isAdmin: boolean;
  joinedAt: string;
}

export interface OrgVerificationRequest {
  id: string;
  organization: Organization;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}
