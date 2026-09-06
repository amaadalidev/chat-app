/**
 * Formats timestamp for chat message bubble (e.g. 10:42 AM)
 */
export const formatMessageTime = (timestamp: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats timestamp for conversation list preview (e.g., "10:42 AM", "Yesterday", "Sun", "09/06/26")
 */
export const formatConversationTime = (timestamp: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }

  return date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: '2-digit' });
};

/**
 * Formats user online / last seen status
 */
export const formatLastSeen = (timestamp?: number, isOnline?: boolean): string => {
  if (isOnline) return 'Online';
  if (!timestamp) return 'Offline';

  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Last seen just now';
  if (diffMins < 60) return `Last seen ${diffMins}m ago`;
  if (diffHours < 24) return `Last seen ${diffHours}h ago`;

  return `Last seen ${formatConversationTime(timestamp)}`;
};
