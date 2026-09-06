import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';
import { db } from '../firebase/firebase';
import { Conversation } from '../models/conversation';
import { UserSummary } from '../models/user';
import { userRepository, IUserRepository } from './UserRepository';

export interface IChatRepository {
  getOrCreateConversation(
    currentUserId: string,
    otherUserId: string
  ): Promise<Conversation>;
  listenToUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe;
}

export class ChatRepository implements IChatRepository {
  private conversationsRef = collection(db, FIRESTORE_COLLECTIONS.CONVERSATIONS);

  constructor(private userRepo: IUserRepository = userRepository) {}

  /**
   * Deterministically gets or creates a 1-on-1 conversation ID
   */
  public getConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }

  async getOrCreateConversation(
    currentUserId: string,
    otherUserId: string
  ): Promise<Conversation> {
    const conversationId = this.getConversationId(currentUserId, otherUserId);
    const convDocRef = doc(this.conversationsRef, conversationId);
    const convSnap = await getDoc(convDocRef);

    if (convSnap.exists()) {
      return convSnap.data() as Conversation;
    }

    // Fetch user profiles to embed in conversation summary
    const [currentUserProfile, otherUserProfile] = await Promise.all([
      this.userRepo.getUserProfile(currentUserId),
      this.userRepo.getUserProfile(otherUserId),
    ]);

    const currentSummary: UserSummary = {
      id: currentUserId,
      displayName: currentUserProfile?.displayName || 'User',
      photoURL: currentUserProfile?.photoURL || null,
      isOnline: currentUserProfile?.isOnline || false,
    };

    const otherSummary: UserSummary = {
      id: otherUserId,
      displayName: otherUserProfile?.displayName || 'User',
      photoURL: otherUserProfile?.photoURL || null,
      isOnline: otherUserProfile?.isOnline || false,
    };

    const now = Date.now();
    const newConversation: Conversation = {
      id: conversationId,
      participants: [currentUserId, otherUserId],
      participantProfiles: {
        [currentUserId]: currentSummary,
        [otherUserId]: otherSummary,
      },
      lastMessage: null,
      unreadCounts: {
        [currentUserId]: 0,
        [otherUserId]: 0,
      },
      typing: {
        [currentUserId]: false,
        [otherUserId]: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(convDocRef, newConversation);
    return newConversation;
  }

  listenToUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      this.conversationsRef,
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const conversations: Conversation[] = [];
        snapshot.forEach((docSnap) => {
          conversations.push(docSnap.data() as Conversation);
        });
        // Sort in-memory chronologically descending by updatedAt
        conversations.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        callback(conversations);
      },
      (error) => {
        console.error('Error listening to user conversations:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  }
}

export const chatRepository = new ChatRepository();
