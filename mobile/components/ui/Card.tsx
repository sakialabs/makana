/**
 * Card Component (Mobile)
 * 
 * Container component with generous spacing and calm styling.
 * Matches web client styling with smooth animations.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  hover?: boolean;
}

export function Card({ children, padding = 'md', style, hover = false }: CardProps) {
  const paddingStyles: Record<string, ViewStyle> = {
    sm: {
      padding: spacing.md,  // 16px
    },
    md: {
      padding: spacing.lg,  // 24px
    },
    lg: {
      padding: spacing.xl,  // 32px
    },
  };

  return (
    <View
      style={[
        styles.card,
        paddingStyles[padding],
        hover && styles.cardHover,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,  // rounded-xl = 12px
    borderWidth: 1,
    borderColor: colors.warmGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHover: {
    borderColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
