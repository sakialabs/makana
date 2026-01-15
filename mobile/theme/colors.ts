/**
 * Makana Design System - Colors
 * 
 * Calm, restrained color palette matching web client exactly.
 * Supports both light and dark modes.
 */

export const colors = {
  // Light Mode - Neutral Palette
  parchment: '#f7f5f2',        // Background - warm, calm base
  softStone: '#ece9e4',        // Secondary background - subtle elevation
  warmGray: '#d6d2cb',         // Borders, dividers - gentle separation
  charcoal: '#1f1f1f',         // Primary text - strong, readable
  mutedAsh: '#5f5f5f',         // Secondary text - softer, supportive
  placeholder: '#9a9a9a',      // Placeholder text - subtle hints
  
  // Primary Accent - Charcoal Base (matching web)
  accent: '#2B2B2B',           // Primary actions - calm, grounded
  accentHover: '#3B3B3B',      // Hover state
  accentPressed: '#1B1B1B',    // Pressed state
  
  // Semantic Colors - Calm, Non-Alarming
  success: '#5a7a5f',          // Success - muted green, calm
  successLight: '#c5d4c7',     // Success backgrounds - very subtle
  warning: '#9a7a4a',          // Warnings - muted amber, gentle
  warningLight: '#d4c5a5',     // Warning backgrounds - very subtle
  error: '#a5544a',            // Errors - muted red, not aggressive
  errorLight: '#d4a5a0',       // Error backgrounds - very subtle
  
  // Utility
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Disabled State
  disabled: '#5a5a5a',
};

// Dark Mode Colors
export const darkColors = {
  // Dark Mode Surfaces
  parchment: '#121212',        // Dark Surface
  softStone: '#1A1A1A',        // Dark Raised Surface
  warmGray: '#4A4A4A',         // Charcoal Border
  charcoal: '#eaeaea',         // Text color
  mutedAsh: '#9a9a9a',         // Muted text
  placeholder: '#6a6a6a',
  
  // Dark Mode Accent
  accent: '#2B2B2B',           // Charcoal Base
  accentHover: '#4A4A4A',      // Lighter for visibility
  accentPressed: '#1B1B1B',    // Darker press state
  
  // Dark Mode Borders
  border: '#4A4A4A',           // Charcoal Border
  borderHover: '#6A6A6A',      // Charcoal Hover Border
  
  // Semantic Colors (same as light mode)
  success: '#5a7a5f',
  successLight: '#c5d4c7',
  warning: '#9a7a4a',
  warningLight: '#d4c5a5',
  error: '#a5544a',
  errorLight: '#d4a5a0',
  
  // Utility
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Disabled State
  disabled: '#5a5a5a',
};

export type ColorName = keyof typeof colors;
