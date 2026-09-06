import { useCallback, useEffect, useRef, useState } from 'react';
import { PAGINATION } from '../constants/collections';
import { Message, MessageType } from '../models/message';
import { messageRepository, IMessageRepository } from '../repositories/MessageRepository';
import { storageRepository, IStorageRepository } from '../repositories/StorageRepository';
import { useAuthStore } from '../store/useAuthStore';
import { parseFirebaseError } from '../utils/errorUtils';

export const useChatViewModel = (
  conversationId: string,
  receiverId: string,
  messageRepo: IMessageRepository = messageRepository,
  storageRepo: IStorageRepository = storageRepository
) => {
  const currentUser = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(!!(conversationId && currentUser));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || !currentUser) {
      return;
    }

    const unsubscribe = messageRepo.listenToMessages(
      conversationId,
      PAGINATION.DEFAULT_MESSAGES_LIMIT,
      (newMessages) => {
        setMessages((prevMessages) => {
          // Filter out temporary optimistic messages that have been saved by server
          const nonTemp = prevMessages.filter((m) => m.id.startsWith('temp_'));
          const tempToKeep = nonTemp.filter(
            (temp) => !newMessages.some((nm) => nm.text === temp.text && nm.createdAt >= temp.createdAt - 5000)
          );
          return [...tempToKeep, ...newMessages];
        });
        setIsLoading(false);

        // Mark messages as read when receiving new messages
        messageRepo.markMessagesAsRead(conversationId, currentUser.id).catch(() => {});
      },
      (err) => {
        setError(parseFirebaseError(err));
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, currentUser, messageRepo]);

  // 2. Load earlier messages (Pagination)
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMore || messages.length === 0 || !conversationId) return;

    const oldestMessage = messages[0];
    if (!oldestMessage) return;

    setIsLoadingMore(true);
    try {
      const result = await messageRepo.loadEarlierMessages(
        conversationId,
        oldestMessage.createdAt,
        PAGINATION.DEFAULT_MESSAGES_LIMIT
      );

      if (result.messages.length > 0) {
        setMessages((prev) => [...result.messages, ...prev]);
      }
      setHasMore(result.hasMore);
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, messages, conversationId, messageRepo]);

  // 3. Send text message with Optimistic Update
  const handleSendMessage = async (customText?: string, mediaUrl?: string, type: MessageType = 'text') => {
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if ((!textToSend && !mediaUrl) || !currentUser || !conversationId) return;

    if (!customText && type === 'text') {
      setInputText('');
    }

    // Reset typing status on send
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    messageRepo.updateTypingStatus(conversationId, currentUser.id, false).catch(() => {});

    // Create optimistic temporary message
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const now = Date.now();
    const tempMessage: Message = {
      id: tempId,
      conversationId,
      senderId: currentUser.id,
      receiverId,
      text: textToSend,
      mediaUrl: mediaUrl || '',
      type,
      status: 'sending',
      createdAt: now,
      readAt: null,
      isDeleted: false,
    };

    // Immediately render in UI
    setMessages((prev) => [...prev, tempMessage]);

    try {
      await messageRepo.sendMessage(
        {
          conversationId,
          receiverId,
          text: textToSend,
          mediaUrl,
          type,
        },
        currentUser.id
      );

      // Remove temp message (real-time listener will deliver server message)
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } catch (err: any) {
      // Mark optimistic message as failed
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m))
      );
      setError(parseFirebaseError(err));
    }
  };

  // 4. Send Image Message
  const handleSendImage = async (imageUri: string) => {
    if (!conversationId || !currentUser) return;
    setIsUploadingImage(true);
    try {
      const downloadUrl = await storageRepo.uploadChatImage(conversationId, imageUri);
      await handleSendMessage('', downloadUrl, 'image');
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 5. Typing indicator handler with auto debounce cleanup
  const handleInputChange = (text: string) => {
    setInputText(text);

    if (!currentUser || !conversationId) return;

    // Trigger typing status: true
    messageRepo.updateTypingStatus(conversationId, currentUser.id, true).catch(() => {});

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-clear typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      messageRepo.updateTypingStatus(conversationId, currentUser.id, false).catch(() => {});
    }, 2000);
  };

  // 6. Delete Message
  const handleDeleteMessage = async (messageId: string) => {
    if (!conversationId) return;
    try {
      await messageRepo.deleteMessage(conversationId, messageId);
    } catch (err: any) {
      setError(parseFirebaseError(err));
    }
  };

  return {
    messages,
    inputText,
    isLoading,
    isLoadingMore,
    hasMore,
    isUploadingImage,
    isOtherUserTyping,
    setIsOtherUserTyping,
    error,
    handleInputChange,
    handleSendMessage,
    handleSendImage,
    loadMoreMessages,
    handleDeleteMessage,
    clearError: () => setError(null),
  };
};
