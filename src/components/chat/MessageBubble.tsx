import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Message } from '../../models/message';
import { theme } from '../../theme';
import { formatMessageTime } from '../../utils/dateFormatter';

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  onDelete,
}) => {
  const { text, mediaUrl, type, status, createdAt, isDeleted } = message;

  const handleLongPress = () => {
    if (!isCurrentUser || isDeleted || !onDelete) return;
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message for everyone?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(message.id),
        },
      ]
    );
  };

  const renderStatus = () => {
    if (!isCurrentUser) return null;
    switch (status) {
      case 'sending':
        return <Text style={styles.statusText}>⏳</Text>;
      case 'sent':
        return <Text style={styles.statusText}>✓</Text>;
      case 'read':
        return <Text style={[styles.statusText, styles.statusRead]}>✓✓</Text>;
      case 'failed':
        return <Text style={[styles.statusText, styles.statusFailed]}>!</Text>;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={handleLongPress}
      style={[
        styles.wrapper,
        isCurrentUser ? styles.wrapperRight : styles.wrapperLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
          isDeleted ? styles.bubbleDeleted : null,
        ]}
      >
        {isDeleted ? (
          <Text style={styles.deletedText}>This message was deleted</Text>
        ) : (
          <>
            {type === 'image' && mediaUrl ? (
              <Image
                source={{ uri: mediaUrl }}
                style={styles.imageMedia}
                contentFit="cover"
                transition={200}
              />
            ) : null}

            {text ? (
              <Text
                style={[
                  styles.messageText,
                  isCurrentUser ? styles.textRight : styles.textLeft,
                ]}
              >
                {text}
              </Text>
            ) : null}
          </>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.timeText}>{formatMessageTime(createdAt)}</Text>
          {renderStatus()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 3,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
  },
  wrapperRight: {
    justifyContent: 'flex-end',
  },
  wrapperLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: theme.spacing.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg - 2,
    paddingVertical: theme.spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  bubbleRight: {
    backgroundColor: theme.colors.sentBubble,
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    backgroundColor: theme.colors.receivedBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bubbleDeleted: {
    backgroundColor: theme.colors.surfaceElevated,
    opacity: 0.6,
  },
  messageText: {
    fontSize: theme.typography.sizes.md,
    lineHeight: 22,
  },
  textRight: {
    color: theme.colors.sentBubbleText,
  },
  textLeft: {
    color: theme.colors.receivedBubbleText,
  },
  deletedText: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    fontSize: theme.typography.sizes.sm,
  },
  imageMedia: {
    width: 230,
    height: 190,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.60)',
    fontWeight: theme.typography.weights.medium,
  },
  statusText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  statusRead: {
    color: '#60A5FA', // Glowing blue checkmarks
    fontWeight: 'bold',
  },
  statusFailed: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});
