/**
 * Container Component (Mobile)
 * 
 * Responsive container with consistent padding matching web.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { spacing } from '../../theme';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  style?: ViewStyle;
}

export function Container({ children, size = 'lg', style }: ContainerProps) {
  const { width } = useWindowDimensions();
  
  // Max widths matching web breakpoints
  const maxWidths = {
    sm: 640,
    md: 768,
    lg: 1024,
    full: width,
  };
  
  return (
    <View style={[styles.container, { maxWidth: maxWidths[size] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.lg,  // 24px matching web
    alignSelf: 'center',
  },
});
