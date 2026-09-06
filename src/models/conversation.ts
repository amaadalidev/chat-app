import { Message } from './message';
import { UserSummary } from './user';

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  participantProfiles: Record<string, UserSummary>;
  lastMessage?: Partial<Message> | null;
  unreadCounts: Record<string, number>; // key: userId, value: unread count
  typing: Record<string, boolean>; // key: userId, value: boolean
  createdAt: number;
  updatedAt: number;
}

export interface ConversationWithOtherUser extends Conversation {
  otherUser: UserSummary;
  unreadCount: number;
  isOtherUserTyping: boolean;
}
