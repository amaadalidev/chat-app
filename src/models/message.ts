export type MessageType = 'text' | 'image';

export type MessageStatus = 'sending' | 'sent' | 'read' | 'failed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: number; // Unix timestamp in ms
  readAt?: number | null;
  isDeleted?: boolean;
}

export interface SendMessageInput {
  conversationId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  type: MessageType;
}

export interface MessagePaginatedResult {
  messages: Message[];
  hasMore: boolean;
  lastDocSnapshot?: unknown;
}
