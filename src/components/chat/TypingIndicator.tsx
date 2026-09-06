import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

export interface TypingIndicatorProps {
  isTyping: boolean;
  userName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isTyping,
  userName = 'User',
}) => {
  if (!isTyping) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{userName} is typing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    backgroundColor: 'transparent',
  },
  text: {
    color: theme.colors.primaryLight,
    fontSize: theme.typography.sizes.xs,
    fontStyle: 'italic',
  },
});
