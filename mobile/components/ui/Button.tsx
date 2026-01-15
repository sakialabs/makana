/**
 * Button Component (Mobile)
 * 
 * Primary action button following Makana's design principles.
 * Matches web client styling exactly with React Native implementation.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface ButtonProps {
  children: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
}: ButtonProps) {
  // Variant styles matching web exactly
  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: colors.accent,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.08,
      elevation: 2,
    },
    secondary: {
      backgroundColor: colors.softStone,
      borderWidth: 1,
      borderColor: colors.warmGray,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  const textVariantStyles: Record<string, TextStyle> = {
    primary: {
      color: colors.white,
    },
    secondary: {
      color: colors.charcoal,
    },
    ghost: {
      color: colors.mutedAsh,
    },
  };

  // Size styles matching web exactly
  const sizeStyles: Record<string, ViewStyle> = {
    sm: {
      paddingHorizontal: 16,  // px-4 = 16px
      paddingVertical: 8,     // py-2 = 8px
    },
    md: {
      paddingHorizontal: 24,  // px-6 = 24px
      paddingVertical: 10,    // py-2.5 = 10px
    },
    lg: {
      paddingHorizontal: 32,  // px-8 = 32px
      paddingVertical: 12,    // py-3 = 12px
    },
  };

  const textSizeStyles: Record<string, TextStyle> = {
    sm: {
      fontSize: typography.sizes.sm,
    },
    md: {
      fontSize: typography.sizes.base,
    },
    lg: {
      fontSize: typography.sizes.lg,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.accent}
        />
      ) : (
        <Text
          style={[
            styles.text,
            textVariantStyles[variant],
            textSizeStyles[size],
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,  // rounded-lg = 8px
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: typography.weights.medium,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.disabled,
  },
});
