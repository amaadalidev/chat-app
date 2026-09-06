import { useEffect, useState } from 'react';
import { UserProfile } from '../models/user';
import { userRepository, IUserRepository } from '../repositories/UserRepository';
import { chatRepository, IChatRepository } from '../repositories/ChatRepository';
import { useAuthStore } from '../store/useAuthStore';
import { parseFirebaseError } from '../utils/errorUtils';

export const useSearchViewModel = (
  userRepo: IUserRepository = userRepository,
  chatRepo: IChatRepository = chatRepository
) => {
  const currentUser = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(!!currentUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    const cleanQuery = searchQuery.trim();

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await userRepo.searchUsers(cleanQuery, currentUser.id);
        if (isMounted) {
          setSearchResults(results);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(parseFirebaseError(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // If query is empty, fetch immediately; otherwise debounce by 300ms
    if (!cleanQuery) {
      fetchUsers();
      return () => {
        isMounted = false;
      };
    }

    const timer = setTimeout(fetchUsers, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, currentUser, userRepo]);

  const startConversationWithUser = async (otherUserId: string) => {
    if (!currentUser) throw new Error('Not authenticated');
    setIsLoading(true);
    try {
      const conversation = await chatRepo.getOrCreateConversation(
        currentUser.id,
        otherUserId
      );
      return conversation;
    } catch (err: any) {
      setError(parseFirebaseError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    startConversationWithUser,
  };
};
