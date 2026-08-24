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

export const MOCK_CHATS: ChatThread[] = [];

