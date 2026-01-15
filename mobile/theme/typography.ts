/**
 * Makana Design System - Typography
 * 
 * Readable typography scale matching web exactly.
 */

export const typography = {
  sizes: {
    xs: 12,      // 0.75rem - small labels
    sm: 14,      // 0.875rem - secondary text
    base: 16,    // 1rem - body text
    lg: 18,      // 1.125rem - large body
    xl: 20,      // 1.25rem - small headings
    '2xl': 24,   // 1.5rem - h3
    '3xl': 30,   // 1.875rem - h2
    '4xl': 36,   // 2.25rem - h1
    '5xl': 48,   // 3rem - hero
  },
  lineHeights: {
    tight: 1.2,      // Headings
    normal: 1.5,     // Body text
    relaxed: 1.75,   // Comfortable reading
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export type FontSize = keyof typeof typography.sizes;
export type LineHeight = keyof typeof typography.lineHeights;
export type FontWeight = keyof typeof typography.weights;
