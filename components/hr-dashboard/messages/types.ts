export type ChatType = "Global" | "Department" | "Individual";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  joinedDate?: string;
  status?: "Online" | "Offline" | "Meeting" | "Break" | "IDLE";
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  reactions?: MessageReaction[];
  attachments?: string[]; // URLs
}

export interface ChatThread {
  id: string;
  name: string;
  type: ChatType;
  membersCount: number;
  messageCount?: number;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive?: boolean;
  isArchived?: boolean;
  icon?: string;
  messages: ChatMessage[];
  members?: ChatUser[];
}

export const MOCK_CHATS: ChatThread[] = [
  {
    id: "global-chat",
    name: "Global Company Chat",
    type: "Global",
    membersCount: 82,
    lastMessage: "Team launch at 12:30 PM in the ca...",
    lastMessageTime: "11:57 AM",
    unreadCount: 3,
    isActive: true,
    members: [
      { id: "u1", name: "Marc Bernal", role: "HR Manager", joinedDate: "Since 2023", avatar: "https://ui.shadcn.com/avatars/01.png" },
      { id: "u2", name: "Sarah Collins", role: "Content Writer", joinedDate: "Since 2022", avatar: "https://ui.shadcn.com/avatars/02.png" },
      { id: "u3", name: "James Hendrix", role: "Designer", joinedDate: "Since 2021", avatar: "https://ui.shadcn.com/avatars/03.png" },
      { id: "u4", name: "Linda Park", role: "Marketing Lead", joinedDate: "Since 2023", avatar: "https://ui.shadcn.com/avatars/04.png" },
      { id: "u5", name: "Tom Rivera", role: "Developer", joinedDate: "Since 2020", avatar: "https://ui.shadcn.com/avatars/05.png" },
      { id: "u6", name: "Emma Stone", role: "Project Manager", joinedDate: "Since 2022", avatar: "https://ui.shadcn.com/avatars/01.png" },
    ],
    messages: [
      {
        id: "m1",
        senderId: "u1",
        senderName: "David Beckham",
        senderRole: "Content Writer",
        content: "Morning everyone! Don’t forget about the all-hands meeting at 2 PM today.",
        timestamp: "9:15 AM",
        isMe: false,
      },
      {
        id: "m2",
        senderId: "u1",
        senderName: "David Beckham",
        senderRole: "Content Writer",
        content: "Morning everyone! Don’t forget about the all-hands meeting at 2 PM today.",
        timestamp: "9:15 AM",
        isMe: false,
        reactions: [{ emoji: "👍", count: 2, users: ["me", "u2"] }],
      },
      {
        id: "m3",
        senderId: "u1",
        senderName: "David Beckham",
        senderRole: "Content Writer",
        content: "Morning everyone! Don’t forget about the all-hands meeting at 2 PM today.",
        timestamp: "9:15 AM",
        isMe: false,
      },
      {
        id: "m4",
        senderId: "me",
        senderName: "Daniel Brown",
        content: "Team launch at 12:30 PM in the cafeteria!",
        timestamp: "9:15 AM",
        isMe: true,
      },
    ],
  },
  {
    id: "marketing-dept",
    name: "Marketing Department",
    type: "Department",
    membersCount: 82,
    lastMessage: "You: Sounds good, let me know if you ar...",
    lastMessageTime: "11:57 AM",
    unreadCount: 0,
    messages: [],
  },
  {
    id: "design-dept",
    name: "Graphic Design Department",
    type: "Department",
    membersCount: 82,
    lastMessage: "You: Sounds good, let me know if you ar...",
    lastMessageTime: "11:57 AM",
    unreadCount: 0,
    messages: [],
  },
  {
    id: "u-john",
    name: "John smith",
    type: "Individual",
    membersCount: 2,
    lastMessage: "You: Sounds good, let me know if you ar...",
    lastMessageTime: "11:57 AM",
    unreadCount: 0,
    messages: [],
  },
  {
    id: "content-dept",
    name: "Content Writing Department",
    type: "Department",
    membersCount: 82,
    lastMessage: "You: Sounds good, let me know if you ar...",
    lastMessageTime: "11:57 AM",
    unreadCount: 0,
    messages: [],
  },
  {
    id: "u-david",
    name: "David Beckham",
    type: "Individual",
    membersCount: 2,
    lastMessage: "Team launch at 12:30 PM in the ca...",
    lastMessageTime: "11:57 AM",
    unreadCount: 3,
    messages: [],
  },
  {
    id: "archive-1",
    name: "Daniel Scott • John Smith",
    type: "Individual",
    membersCount: 2,
    messageCount: 143,
    lastMessage: "143 Messages",
    lastMessageTime: "2 Members",
    unreadCount: 0,
    isArchived: true,
    members: [
      { id: "u-daniel", name: "Daniel Scott", role: "HR Manager", avatar: "https://ui.shadcn.com/avatars/01.png" },
      { id: "u-john", name: "John Smith", role: "Developer", avatar: "https://ui.shadcn.com/avatars/02.png" },
    ],
    messages: [
      { id: "am1", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false },
      { id: "am2", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false, reactions: [{ emoji: "👍", count: 2, users: ["me"] }] },
      { id: "am3", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false },
      { id: "am4", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false },
      { id: "am5", senderId: "me", senderName: "Daniel Brown", content: "Team launch at 12:30 PM in the cafeteria!", timestamp: "9:15 AM", isMe: true },
    ],
  },
  {
    id: "archive-2",
    name: "Daniel Scott • Graphic Design",
    type: "Department",
    membersCount: 8,
    messageCount: 143,
    lastMessage: "143 Messages",
    lastMessageTime: "8 Members",
    unreadCount: 0,
    isArchived: true,
    members: [
      { id: "u-daniel", name: "Daniel Scott", role: "HR Manager", avatar: "https://ui.shadcn.com/avatars/01.png" },
      { id: "u-design", name: "Graphic Design Team", role: "Design", avatar: "https://ui.shadcn.com/avatars/03.png" },
    ],
    messages: [
      { id: "bm1", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false },
      { id: "bm2", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false, reactions: [{ emoji: "👍", count: 2, users: ["me"] }] },
      { id: "bm3", senderId: "me", senderName: "Daniel Brown", content: "Team launch at 12:30 PM in the cafeteria!", timestamp: "9:15 AM", isMe: true },
    ],
  },
  {
    id: "archive-3",
    name: "Daniel Scott • John Smith",
    type: "Individual",
    membersCount: 2,
    messageCount: 143,
    lastMessage: "143 Messages",
    lastMessageTime: "2 Members",
    unreadCount: 0,
    isArchived: true,
    members: [
      { id: "u-daniel", name: "Daniel Scott", role: "HR Manager", avatar: "https://ui.shadcn.com/avatars/01.png" },
      { id: "u-john2", name: "John Smith", role: "Developer", avatar: "https://ui.shadcn.com/avatars/02.png" },
    ],
    messages: [
      { id: "cm1", senderId: "u-daniel", senderName: "David Beckham", senderRole: "Content Writer", content: "Morning everyone! Don't forget about the all-hands meeting at 2 PM today.", timestamp: "9:15 AM", isMe: false },
      { id: "cm2", senderId: "me", senderName: "Daniel Brown", content: "Team launch at 12:30 PM in the cafeteria!", timestamp: "9:15 AM", isMe: true },
    ],
  },
];

