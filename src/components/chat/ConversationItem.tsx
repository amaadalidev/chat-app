import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConversationWithOtherUser } from '../../models/conversation';
import { theme } from '../../theme';
import { formatConversationTime } from '../../utils/dateFormatter';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export interface ConversationItemProps {
  conversation: ConversationWithOtherUser;
  onPress: (conversation: ConversationWithOtherUser) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const { otherUser, lastMessage, unreadCount, isOtherUserTyping, updatedAt } =
    conversation;

  const lastMessageText = isOtherUserTyping
    ? 'Typing...'
    : lastMessage?.type === 'image'
    ? '📷 Photo'
    : lastMessage?.text || 'No messages yet';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        unreadCount > 0 ? styles.unreadCard : null,
      ]}
      onPress={() => onPress(conversation)}
      activeOpacity={0.7}
    >
      <Avatar
        uri={otherUser.photoURL}
        name={otherUser.displayName}
        size="md"
        isOnline={otherUser.isOnline}
        showPresence
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.displayName} numberOfLines={1}>
            {otherUser.displayName}
          </Text>
          <Text
            style={[
              styles.timestamp,
              unreadCount > 0 ? styles.unreadTimestamp : null,
            ]}
          >
            {formatConversationTime(lastMessage?.createdAt || updatedAt)}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text
            style={[
              styles.lastMessage,
              isOtherUserTyping ? styles.typingText : null,
              unreadCount > 0 ? styles.unreadMessageText : null,
            ]}
            numberOfLines={1}
          >
            {lastMessageText}
          </Text>

          <Badge count={unreadCount} variant="primary" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md + 2,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  unreadCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  timestamp: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.xs,
  },
  unreadTimestamp: {
    color: theme.colors.primaryLight,
    fontWeight: theme.typography.weights.medium,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  typingText: {
    color: theme.colors.primaryLight,
    fontStyle: 'italic',
    fontWeight: theme.typography.weights.medium,
  },
  unreadMessageText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.semibold,
  },
});
