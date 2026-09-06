export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
} as const;

export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  CHAT_IMAGES: 'chat_images',
} as const;

export const PAGINATION = {
  DEFAULT_MESSAGES_LIMIT: 20,
  USERS_SEARCH_LIMIT: 10,
} as const;
