import { useEffect, useState } from 'react';
import { ConversationWithOtherUser } from '../models/conversation';
import { chatRepository, IChatRepository } from '../repositories/ChatRepository';
import { useAuthStore } from '../store/useAuthStore';
import { parseFirebaseError } from '../utils/errorUtils';

export const useConversationsViewModel = (
  chatRepo: IChatRepository = chatRepository
) => {
  const currentUser = useAuthStore((state) => state.user);
  const [conversations, setConversations] = useState<ConversationWithOtherUser[]>([]);
  const [isLoading, setIsLoading] = useState(!!currentUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = chatRepo.listenToUserConversations(
      currentUser.id,
      (rawConversations) => {
        const formatted: ConversationWithOtherUser[] = rawConversations.map((conv) => {
          const otherUserId = conv.participants.find((id) => id !== currentUser.id) || '';
          const otherUser = conv.participantProfiles[otherUserId] || {
            id: otherUserId,
            displayName: 'Unknown User',
            photoURL: null,
            isOnline: false,
          };
          const unreadCount = conv.unreadCounts?.[currentUser.id] || 0;
          const isOtherUserTyping = conv.typing?.[otherUserId] || false;

          return {
            ...conv,
            otherUser,
            unreadCount,
            isOtherUserTyping,
          };
        });

        setConversations(formatted);
        setIsLoading(false);
      },
      (err) => {
        setError(parseFirebaseError(err));
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser, chatRepo]);

  return {
    conversations,
    isLoading: currentUser ? isLoading : false,
    error,
    currentUser,
  };
};
