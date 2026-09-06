import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../theme';

export interface BadgeProps {
  count?: number;
  text?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  text,
  variant = 'primary',
  style,
}) => {
  const displayValue = count !== undefined ? (count > 99 ? '99+' : count.toString()) : text;

  if (!displayValue || (count !== undefined && count <= 0)) return null;

  return (
    <View style={[styles.badge, styles[`variant_${variant}`], style]}>
      <Text style={styles.text}>{displayValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.spacing.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
  },
  variant_primary: {
    backgroundColor: theme.colors.primary,
  },
  variant_secondary: {
    backgroundColor: theme.colors.surfaceSubtle,
  },
  variant_danger: {
    backgroundColor: theme.colors.error,
  },
  text: {
    color: theme.colors.textOnPrimary,
    fontSize: 11,
    fontWeight: theme.typography.weights.bold,
  },
});
