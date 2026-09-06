import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, PAGINATION } from '../constants/collections';
import { db } from '../firebase/firebase';
import {
  Message,
  MessagePaginatedResult,
  SendMessageInput,
} from '../models/message';

export interface IMessageRepository {
  listenToMessages(
    conversationId: string,
    limitCount: number,
    callback: (messages: Message[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe;
  loadEarlierMessages(
    conversationId: string,
    beforeTimestamp: number,
    limitCount?: number
  ): Promise<MessagePaginatedResult>;
  sendMessage(input: SendMessageInput, senderId: string): Promise<Message>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  updateTypingStatus(
    conversationId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void>;
  deleteMessage(conversationId: string, messageId: string): Promise<void>;
}

export class MessageRepository implements IMessageRepository {
  private getMessagesCollectionRef(conversationId: string) {
    return collection(
      db,
      FIRESTORE_COLLECTIONS.CONVERSATIONS,
      conversationId,
      FIRESTORE_COLLECTIONS.MESSAGES
    );
  }

  listenToMessages(
    conversationId: string,
    limitCount: number = PAGINATION.DEFAULT_MESSAGES_LIMIT,
    callback: (messages: Message[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!conversationId) {
      callback([]);
      return () => {};
    }

    const messagesRef = this.getMessagesCollectionRef(conversationId);
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(limitCount));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((docSnap) => {
          messages.push(docSnap.data() as Message);
        });
        // Sort chronologically ascending for UI list display
        messages.reverse();
        callback(messages);
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  }

  async loadEarlierMessages(
    conversationId: string,
    beforeTimestamp: number,
    limitCount: number = PAGINATION.DEFAULT_MESSAGES_LIMIT
  ): Promise<MessagePaginatedResult> {
    const messagesRef = this.getMessagesCollectionRef(conversationId);
    const q = query(
      messagesRef,
      where('createdAt', '<', beforeTimestamp),
      orderBy('createdAt', 'desc'),
      limit(limitCount + 1)
    );

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const hasMore = docs.length > limitCount;
    const resultDocs = hasMore ? docs.slice(0, limitCount) : docs;

    const messages: Message[] = resultDocs.map((d) => d.data() as Message);
    messages.reverse(); // Chronological order

    return {
      messages,
      hasMore,
    };
  }

  async sendMessage(input: SendMessageInput, senderId: string): Promise<Message> {
    const { conversationId, receiverId, text, mediaUrl, type } = input;
    const messagesRef = this.getMessagesCollectionRef(conversationId);
    const messageDocRef = doc(messagesRef);

    const now = Date.now();
    const newMessage: Message = {
      id: messageDocRef.id,
      conversationId,
      senderId,
      receiverId,
      text: text || '',
      mediaUrl: mediaUrl || '',
      type,
      status: 'sent',
      createdAt: now,
      readAt: null,
      isDeleted: false,
    };

    // Save message doc
    await setDoc(messageDocRef, newMessage);

    // Update conversation metadata & increment unread counter for receiver
    const convDocRef = doc(db, FIRESTORE_COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(convDocRef, {
      lastMessage: {
        id: newMessage.id,
        text: newMessage.text,
        type: newMessage.type,
        senderId: newMessage.senderId,
        createdAt: newMessage.createdAt,
      },
      updatedAt: now,
      [`unreadCounts.${receiverId}`]: increment(1),
      [`typing.${senderId}`]: false,
    });

    return newMessage;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    if (!conversationId || !userId) return;

    const convDocRef = doc(db, FIRESTORE_COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(convDocRef, {
      [`unreadCounts.${userId}`]: 0,
    });

    // Update unread messages status to 'read'
    const messagesRef = this.getMessagesCollectionRef(conversationId);
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('status', '!=', 'read')
    );

    const unreadSnap = await getDocs(q);
    if (!unreadSnap.empty) {
      const batch = writeBatch(db);
      const now = Date.now();

      unreadSnap.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          status: 'read',
          readAt: now,
        });
      });

      await batch.commit();
    }
  }

  async updateTypingStatus(
    conversationId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    if (!conversationId || !userId) return;
    const convDocRef = doc(db, FIRESTORE_COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(convDocRef, {
      [`typing.${userId}`]: isTyping,
    });
  }

  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    const messageDocRef = doc(
      db,
      FIRESTORE_COLLECTIONS.CONVERSATIONS,
      conversationId,
      FIRESTORE_COLLECTIONS.MESSAGES,
      messageId
    );

    await updateDoc(messageDocRef, {
      isDeleted: true,
      text: 'This message was deleted',
      mediaUrl: '',
    });
  }
}

export const messageRepository = new MessageRepository();
