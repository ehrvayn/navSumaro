import { GroupConversation } from "../types";
import { mockGroups } from "./mockGroup";

export const mockGroupConversations: GroupConversation[] = [
  {
    id: mockGroups[0].id,
    title: mockGroups[0].name,
    avatar: mockGroups[0].emoji,
    isGroup: true,
    adminId: mockGroups[0].members.find(m => m.isAdmin)?.user.id || "",
    unread: 3,
    lastMessage: "I'll upload the PDF in a bit, just finishing my lunch.",
    lastTime: "2:45 PM",
    participants: mockGroups[0].members,
    messages: [
      {
        id: "m1_1",
        senderId: mockGroups[0].members[0].user.id,
        senderName: mockGroups[0].members[0].user.firstname,
        senderAvatar: mockGroups[0].members[0].user.avatar,
        text: "Hey guys, welcome to the CS201 study group! Let's keep this organized.",
        time: "10:00 AM",
        seenBy: [mockGroups[0].members[1].user.id, mockGroups[0].members[2].user.id, mockGroups[0].members[3].user.id, mockGroups[0].members[4].user.id]
      },
      {
        id: "m1_2",
        senderId: mockGroups[0].members[1].user.id,
        senderName: mockGroups[0].members[1].user.firstname,
        senderAvatar: mockGroups[0].members[1].user.avatar,
        text: "Thanks for the add! Does anyone have the source code for the Binary Search Tree demo?",
        time: "11:15 AM",
        seenBy: [mockGroups[0].members[0].user.id, mockGroups[0].members[2].user.id]
      },
      {
        id: "m1_3",
        senderId: mockGroups[0].members[2].user.id,
        senderName: mockGroups[0].members[2].user.firstname,
        senderAvatar: mockGroups[0].members[2].user.avatar,
        text: "I have it on my GitHub, wait let me find the link.",
        time: "1:30 PM",
        seenBy: [mockGroups[0].members[0].user.id, mockGroups[0].members[1].user.id]
      },
      {
        id: "m1_4",
        senderId: mockGroups[0].members[3].user.id,
        senderName: mockGroups[0].members[3].user.firstname,
        senderAvatar: mockGroups[0].members[3].user.avatar,
        text: "Can someone share the notes for Linked Lists? I missed the lecture yesterday.",
        time: "2:15 PM",
        seenBy: [mockGroups[0].members[0].user.id]
      },
      {
        id: "m1_5",
        senderId: mockGroups[0].members[4].user.id,
        senderName: mockGroups[0].members[4].user.firstname,
        senderAvatar: mockGroups[0].members[4].user.avatar,
        text: "I'll upload the PDF in a bit, just finishing my lunch.",
        time: "2:45 PM",
        seenBy: [mockGroups[0].members[0].user.id]
      }
    ]
  },
  {
    id: mockGroups[1].id,
    title: mockGroups[1].name,
    avatar: mockGroups[1].emoji,
    isGroup: true,
    adminId: mockGroups[1].members.find(m => m.isAdmin)?.user.id || "",
    unread: 0,
    lastMessage: "That would be a lifesaver, thank you!",
    lastTime: "Yesterday",
    participants: mockGroups[1].members,
    messages: [
      {
        id: "m2_1",
        senderId: mockGroups[1].members[0].user.id,
        senderName: mockGroups[1].members[0].user.firstname,
        senderAvatar: mockGroups[1].members[0].user.avatar,
        text: "I just finished the Methodology section! It was a grind but it's finally done.",
        time: "Yesterday 4:00 PM",
        seenBy: [mockGroups[1].members[1].user.id, mockGroups[1].members[2].user.id]
      },
      {
        id: "m2_2",
        senderId: mockGroups[1].members[1].user.id,
        senderName: mockGroups[1].members[1].user.firstname,
        senderAvatar: mockGroups[1].members[1].user.avatar,
        text: "Great job! I'm still stuck on the Literature Review. Too many sources to cite.",
        time: "Yesterday 4:30 PM",
        seenBy: [mockGroups[1].members[0].user.id, mockGroups[1].members[2].user.id]
      },
      {
        id: "m2_3",
        senderId: mockGroups[1].members[2].user.id,
        senderName: mockGroups[1].members[2].user.firstname,
        senderAvatar: mockGroups[1].members[2].user.avatar,
        text: "Do you want me to send you the Zotero folder I made for our topic?",
        time: "Yesterday 5:00 PM",
        seenBy: [mockGroups[1].members[0].user.id, mockGroups[1].members[1].user.id]
      },
      {
        id: "m2_4",
        senderId: mockGroups[1].members[1].user.id,
        senderName: mockGroups[1].members[1].user.firstname,
        senderAvatar: mockGroups[1].members[1].user.avatar,
        text: "That would be a lifesaver, thank you!",
        time: "Yesterday 5:15 PM",
        seenBy: [mockGroups[1].members[0].user.id, mockGroups[1].members[2].user.id]
      }
    ]
  },
  {
    id: mockGroups[2].id,
    title: mockGroups[2].name,
    avatar: mockGroups[2].emoji,
    isGroup: true,
    adminId: mockGroups[2].members.find(m => m.isAdmin)?.user.id || "",
    unread: 12,
    lastMessage: "I'll go with React then, let's start the repo.",
    lastTime: "11:45 AM",
    participants: mockGroups[2].members,
    messages: [
      {
        id: "m3_1",
        senderId: mockGroups[2].members[0].user.id,
        senderName: mockGroups[2].members[0].user.firstname,
        senderAvatar: mockGroups[2].members[0].user.avatar,
        text: "What stack are we using for the final project?",
        time: "10:00 AM",
        seenBy: [mockGroups[2].members[1].user.id, mockGroups[2].members[2].user.id]
      },
      {
        id: "m3_2",
        senderId: mockGroups[2].members[1].user.id,
        senderName: mockGroups[2].members[1].user.firstname,
        senderAvatar: mockGroups[2].members[1].user.avatar,
        text: "React vs Vue, what's better for the project?",
        time: "11:20 AM",
        seenBy: [mockGroups[2].members[0].user.id]
      },
      {
        id: "m3_3",
        senderId: mockGroups[2].members[2].user.id,
        senderName: mockGroups[2].members[2].user.firstname,
        senderAvatar: mockGroups[2].members[2].user.avatar,
        text: "React has better library support for the maps we need.",
        time: "11:35 AM",
        seenBy: [mockGroups[2].members[0].user.id]
      },
      {
        id: "m3_4",
        senderId: mockGroups[2].members[1].user.id,
        senderName: mockGroups[2].members[1].user.firstname,
        senderAvatar: mockGroups[2].members[1].user.avatar,
        text: "I'll go with React then, let's start the repo.",
        time: "11:45 AM",
        seenBy: [mockGroups[2].members[0].user.id]
      }
    ]
  },
  {
    id: mockGroups[3].id,
    title: mockGroups[3].name,
    avatar: mockGroups[3].emoji,
    isGroup: true,
    adminId: mockGroups[3].members.find(m => m.isAdmin)?.user.id || "",
    unread: 1,
    lastMessage: "Is the exam multiple choice or solving?",
    lastTime: "10:30 AM",
    participants: mockGroups[3].members,
    messages: [
      {
        id: "m4_1",
        senderId: mockGroups[3].members[0].user.id,
        senderName: mockGroups[3].members[0].user.firstname,
        senderAvatar: mockGroups[3].members[0].user.avatar,
        text: "Sample problems for GenMath are out on the portal.",
        time: "9:00 AM",
        seenBy: [mockGroups[3].members[1].user.id, mockGroups[3].members[2].user.id]
      },
      {
        id: "m4_2",
        senderId: mockGroups[3].members[1].user.id,
        senderName: mockGroups[3].members[1].user.firstname,
        senderAvatar: mockGroups[3].members[1].user.avatar,
        text: "The solving part looks brutal. We need to practice the synthetic division.",
        time: "9:45 AM",
        seenBy: [mockGroups[3].members[0].user.id, mockGroups[3].members[2].user.id]
      },
      {
        id: "m4_3",
        senderId: mockGroups[3].members[2].user.id,
        senderName: mockGroups[3].members[2].user.firstname,
        senderAvatar: mockGroups[3].members[2].user.avatar,
        text: "Is the exam multiple choice or solving?",
        time: "10:30 AM",
        seenBy: [mockGroups[3].members[0].user.id]
      }
    ]
  }
];