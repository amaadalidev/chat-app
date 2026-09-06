import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, PAGINATION } from '../constants/collections';
import { db } from '../firebase/firebase';
import { UserProfile, UserProfileUpdateInput } from '../models/user';

export interface IUserRepository {
  createUserProfile(profile: UserProfile): Promise<void>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, updates: UserProfileUpdateInput): Promise<void>;
  setUserPresence(userId: string, isOnline: boolean): Promise<void>;
  searchUsers(searchQuery: string, currentUserId: string): Promise<UserProfile[]>;
}

export class UserRepository implements IUserRepository {
  private usersRef = collection(db, FIRESTORE_COLLECTIONS.USERS);

  async createUserProfile(profile: UserProfile): Promise<void> {
    const userDocRef = doc(this.usersRef, profile.id);
    await setDoc(userDocRef, profile, { merge: true });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    const userDocRef = doc(this.usersRef, userId);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as UserProfile;
  }

  async updateUserProfile(
    userId: string,
    updates: UserProfileUpdateInput
  ): Promise<void> {
    const userDocRef = doc(this.usersRef, userId);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  async setUserPresence(userId: string, isOnline: boolean): Promise<void> {
    if (!userId) return;
    const userDocRef = doc(this.usersRef, userId);
    await updateDoc(userDocRef, {
      isOnline,
      lastSeen: Date.now(),
    });
  }

  async searchUsers(
    searchQuery: string,
    currentUserId: string
  ): Promise<UserProfile[]> {
    const cleanQuery = searchQuery.trim();

    // Return all registered users if search query is empty
    if (!cleanQuery) {
      const qAll = query(this.usersRef, limit(20));
      const snapshotAll = await getDocs(qAll);
      const allUsers: UserProfile[] = [];
      snapshotAll.forEach((docSnap) => {
        const data = docSnap.data() as UserProfile;
        if (data.id !== currentUserId) {
          allUsers.push(data);
        }
      });
      return allUsers;
    }

    // Simple prefix search using Firestore query range
    const q = query(
      this.usersRef,
      where('displayName', '>=', cleanQuery),
      where('displayName', '<=', cleanQuery + '\uf8ff'),
      limit(PAGINATION.USERS_SEARCH_LIMIT)
    );

    const snapshot = await getDocs(q);
    const users: UserProfile[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as UserProfile;
      if (data.id !== currentUserId) {
        users.push(data);
      }
    });

    // Fallback: If no match by name, check by exact email
    if (users.length === 0 && cleanQuery.includes('@')) {
      const emailQuery = query(
        this.usersRef,
        where('email', '==', cleanQuery.toLowerCase()),
        limit(5)
      );
      const emailSnap = await getDocs(emailQuery);
      emailSnap.forEach((docSnap) => {
        const data = docSnap.data() as UserProfile;
        if (data.id !== currentUserId) {
          users.push(data);
        }
      });
    }

    return users;
  }
}

export const userRepository = new UserRepository();
