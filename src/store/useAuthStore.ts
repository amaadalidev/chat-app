import { create } from 'zustand';
import { UserProfile } from '../models/user';

interface AuthStoreState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isInitialLoading: false,
      error: null,
    }),

  setInitialLoading: (isInitialLoading) => set({ isInitialLoading }),

  setError: (error) => set({ error, isInitialLoading: false }),

  clearSession: () =>
    set({
      user: null,
      isAuthenticated: false,
      isInitialLoading: false,
      error: null,
    }),
}));
