import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { UserProfile } from '../models/user';
import { userRepository, IUserRepository } from './UserRepository';

export interface IAuthRepository {
  signUp(email: string, pass: string, displayName: string): Promise<UserProfile>;
  signIn(email: string, pass: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  getCurrentUser(): FirebaseUser | null;
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void;
}

export class AuthRepository implements IAuthRepository {
  constructor(private userRepo: IUserRepository = userRepository) {}

  async signUp(email: string, pass: string, displayName: string): Promise<UserProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const firebaseUser = cred.user;

    // Update Firebase Auth Display Name
    await updateFirebaseProfile(firebaseUser, { displayName });

    const now = Date.now();
    const newUserProfile: UserProfile = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email.trim(),
      displayName: displayName.trim(),
      photoURL: null,
      bio: 'Hey there! I am using ChatApp.',
      isOnline: true,
      lastSeen: now,
      createdAt: now,
      updatedAt: now,
    };

    // Save profile to Firestore
    await this.userRepo.createUserProfile(newUserProfile);

    return newUserProfile;
  }

  async signIn(email: string, pass: string): Promise<UserProfile> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const firebaseUser = cred.user;

    let profile = await this.userRepo.getUserProfile(firebaseUser.uid);

    if (!profile) {
      // Fallback profile if doc missing
      const now = Date.now();
      profile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email.trim(),
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL || null,
        bio: 'Hey there! I am using ChatApp.',
        isOnline: true,
        lastSeen: now,
        createdAt: now,
        updatedAt: now,
      };
      await this.userRepo.createUserProfile(profile);
    } else {
      // Update online status on login
      await this.userRepo.setUserPresence(profile.id, true);
    }

    return profile;
  }

  async signOut(): Promise<void> {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await this.userRepo.setUserPresence(currentUser.uid, false);
    }
    await signOut(auth);
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await this.userRepo.getUserProfile(firebaseUser.uid);
          callback(profile);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}

export const authRepository = new AuthRepository();
