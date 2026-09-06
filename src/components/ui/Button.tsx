import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../theme';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'dangerOutline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  textStyle,
  ...props
}) => {
  const isButtonDisabled = disabled || isLoading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    styles[`size_${size}` as keyof typeof styles] as ViewStyle,
    styles[`variant_${variant}` as keyof typeof styles] as ViewStyle,
    isButtonDisabled ? styles.disabled : {},
    style as ViewStyle,
  ];

  const labelStyles: TextStyle[] = [
    styles.textBase,
    styles[`textSize_${size}` as keyof typeof styles] as TextStyle,
    styles[`textVariant_${variant}` as keyof typeof styles] as TextStyle,
    isButtonDisabled ? styles.disabledText : {},
    textStyle as TextStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isButtonDisabled}
      style={containerStyles}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'dangerOutline' ? theme.colors.error : theme.colors.textOnPrimary}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={labelStyles}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    gap: 8,
  },
  textBase: {},
  // Sizes
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  size_md: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  // Variants
  variant_primary: {
    backgroundColor: '#4F46E5',
  },
  variant_secondary: {
    backgroundColor: '#F1F5F9',
  },
  variant_outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  variant_danger: {
    backgroundColor: '#EF4444',
  },
  variant_dangerOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  // Text Sizes
  textSize_sm: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
  },
  textSize_md: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  textSize_lg: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
  },

  // Text Variants
  textVariant_primary: {
    color: '#FFFFFF',
  },
  textVariant_secondary: {
    color: '#1E293B',
  },
  textVariant_outline: {
    color: '#1E293B',
  },
  textVariant_danger: {
    color: '#FFFFFF',
  },
  textVariant_dangerOutline: {
    color: '#EF4444',
  },

  // Disabled State
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.textDisabled,
  },
});
