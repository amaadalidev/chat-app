export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  bio?: string;
  isOnline: boolean;
  lastSeen: number; // Unix timestamp in ms
  pushToken?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserSummary {
  id: string;
  displayName: string;
  photoURL?: string | null;
  isOnline: boolean;
}

export interface UserPresence {
  isOnline: boolean;
  lastSeen: number;
}

export interface UserProfileUpdateInput {
  displayName?: string;
  photoURL?: string | null;
  bio?: string;
  pushToken?: string | null;
}
