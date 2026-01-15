/**
 * Design Tokens for Mobile
 * 
 * Centralized design system tokens matching web for cross-platform consistency.
 * All values follow WCAG AA contrast requirements.
 */

export const colors = {
  // Neutral palette (primary)
  parchment: '#f7f5f2',      // Background - warm, calm base
  softStone: '#ece9e4',      // Secondary background - subtle elevation
  lightStone: '#d6d2cb',     // Borders, dividers - gentle separation
  charcoal: '#1f1f1f',       // Primary text - strong, readable
  slate: '#5f5f5f',          // Secondary text - softer, supportive
  muted: '#9a9a9a',          // Placeholder text - subtle hints
  
  // Accent (single, intentional)
  deepCharcoal: '#2B2B2B',      // Primary actions - calm, grounded
  deepCharcoalHover: '#1B1B1B', // Hover/pressed state - slightly darker
  deepCharcoalFocus: '#2B2B2B', // Focus ring - same as primary
  
  // Semantic colors (calm, non-alarming)
  error: '#a5544a',          // Errors - muted red, not aggressive
  errorLight: '#d4a5a0',     // Error backgrounds - very subtle
  success: '#5a7a5f',        // Success - muted green, calm
  successLight: '#c5d4c7',   // Success backgrounds - very subtle
  warning: '#9a7a4a',        // Warnings - muted amber, gentle
  warningLight: '#d4c5a5',   // Warning backgrounds - very subtle
  
  // Utility
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const spacing = {
  // Base unit: 4
  xs: 4,    // 4 - tight spacing
  sm: 8,    // 8 - compact spacing
  md: 16,   // 16 - standard spacing
  lg: 24,   // 24 - generous spacing
  xl: 32,   // 32 - section spacing
  '2xl': 48,  // 48 - large section spacing
  '3xl': 64,  // 64 - page spacing
  '4xl': 96,  // 96 - hero spacing
} as const;

export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,    // Small labels
    sm: 14,    // Secondary text
    base: 16,  // Body text
    lg: 18,    // Large body
    xl: 20,    // Small headings
    '2xl': 24, // h3
    '3xl': 30, // h2
    '4xl': 36, // h1
    '5xl': 48, // Hero
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,     // Headings
    normal: 1.5,    // Body text
    relaxed: 1.75,  // Comfortable reading
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.01,
    normal: 0,
    wide: 0.01,
  },
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,   // Subtle rounding
  md: 8,   // Standard rounding
  lg: 12,  // Generous rounding
  xl: 16,  // Large rounding
  full: 9999, // Fully rounded (pills, circles)
} as const;

export const shadows = {
  // React Native shadow properties
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const animations = {
  // Duration in milliseconds
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  
  // Easing curves (for Animated API)
  easing: {
    easeIn: 'easeIn' as const,
    easeOut: 'easeOut' as const,
    easeInOut: 'easeInOut' as const,
  },
} as const;

/**
 * Dark mode colors (for future implementation)
 */
export const darkColors = {
  parchment: '#1a1a1a',
  softStone: '#2a2a2a',
  lightStone: '#3a3a3a',
  charcoal: '#e5e5e5',
  slate: '#a0a0a0',
  muted: '#6a6a6a',
  deepOlive: '#6a8a7a',
  deepOliveHover: '#7a9a8a',
  deepOliveFocus: '#6a8a7a',
  error: '#c5746a',
  errorLight: '#4a3a38',
  success: '#7a9a7f',
  successLight: '#3a4a3c',
  warning: '#ba9a6a',
  warningLight: '#4a4238',
} as const;

/**
 * Design principles (same as web)
 */
export const principles = {
  // One primary action per screen
  primaryAction: 'Use Deep Olive accent for the single most important action',
  
  // Generous spacing
  spacing: 'Minimum 16px between sections, prefer 24px or more',
  
  // Calm feedback
  feedback: 'No confetti, no animations, no pressure. Calm acknowledgments only.',
  
  // Readable typography
  typography: 'Line height 1.5 for body, 1.2 for headings. Clear hierarchy.',
  
  // Restrained color
  color: 'Neutral-first palette. Single accent color (Deep Olive) for primary actions.',
  
  // No pressure mechanics
  noPressure: 'No streak counters, no leaderboards, no performance metrics.',
} as const;

/**
 * Platform-specific adjustments
 */
export const platform = {
  // iOS specific
  ios: {
    statusBarHeight: 44,
    tabBarHeight: 49,
    headerHeight: 44,
  },
  
  // Android specific
  android: {
    statusBarHeight: 24,
    navigationBarHeight: 48,
    headerHeight: 56,
  },
} as const;
