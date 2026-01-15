/**
 * Logo Component (Mobile)
 * 
 * Makana logo with static and animated variants.
 * Matches web implementation.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  variant?: 'static' | 'animated';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'static', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
  };

  const logoSource = variant === 'animated'
    ? require('../../assets/logo.gif')
    : require('../../assets/logo.png');

  return (
    <View style={styles.container}>
      <Image
        source={logoSource}
        style={[styles.logo, sizes[size]]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Size is set dynamically via props
  },
});
