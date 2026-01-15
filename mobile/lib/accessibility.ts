/**
 * Accessibility Utilities for Mobile
 * 
 * Provides utilities for WCAG AA compliance and accessible mobile experiences.
 */

import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.warn('Failed to check screen reader status:', error);
    return false;
  }
}

/**
 * Announce message to screen reader
 * 
 * @param message - Message to announce
 * @param options - Announcement options
 */
export function announceForAccessibility(
  message: string,
  options?: { queue?: boolean }
): void {
  if (!message) return;
  
  try {
    AccessibilityInfo.announceForAccessibility(message);
  } catch (error) {
    console.warn('Failed to announce for accessibility:', error);
  }
}

/**
 * Generate accessible label for interactive elements
 * 
 * @param label - Primary label
 * @param hint - Optional hint text
 * @param state - Optional state description
 * @returns Formatted accessible label
 */
export function generateAccessibleLabel(
  label: string,
  hint?: string,
  state?: string
): string {
  const parts = [label];
  
  if (state) {
    parts.push(state);
  }
  
  if (hint) {
    parts.push(hint);
  }
  
  return parts.join('. ');
}

/**
 * Check WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns Whether contrast meets WCAG AA
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  
  return ratio >= requiredRatio;
}

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 * 
 * @param hex - Hex color code
 * @returns Relative luminance (0-1)
 */
function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = rgb.map((val) => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 * 
 * @param hex - Hex color code
 * @returns RGB array [r, g, b] or null if invalid
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Accessibility role mappings for common UI elements
 */
export const AccessibilityRoles = {
  button: 'button' as const,
  link: 'link' as const,
  header: 'header' as const,
  text: 'text' as const,
  image: 'image' as const,
  imageButton: 'imagebutton' as const,
  search: 'search' as const,
  adjustable: 'adjustable' as const,
  alert: 'alert' as const,
  checkbox: 'checkbox' as const,
  radio: 'radio' as const,
  switch: 'switch' as const,
  tab: 'tab' as const,
  tablist: 'tablist' as const,
  timer: 'timer' as const,
  toolbar: 'toolbar' as const,
  summary: 'summary' as const,
  menu: 'menu' as const,
  menubar: 'menubar' as const,
  menuitem: 'menuitem' as const,
  progressbar: 'progressbar' as const,
  scrollbar: 'scrollbar' as const,
  spinbutton: 'spinbutton' as const,
  none: 'none' as const,
};

/**
 * Accessibility state helpers
 */
export const AccessibilityStates = {
  disabled: (disabled: boolean) => ({ disabled }),
  selected: (selected: boolean) => ({ selected }),
  checked: (checked: boolean | 'mixed') => ({ checked }),
  busy: (busy: boolean) => ({ busy }),
  expanded: (expanded: boolean) => ({ expanded }),
};

/**
 * Common accessibility hints
 */
export const AccessibilityHints = {
  button: 'Double tap to activate',
  link: 'Double tap to open',
  toggle: 'Double tap to toggle',
  input: 'Double tap to edit',
  dismiss: 'Double tap to dismiss',
  navigate: 'Double tap to navigate',
};

/**
 * Reduce motion preference check
 */
export async function prefersReducedMotion(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    try {
      return await AccessibilityInfo.isReduceMotionEnabled();
    } catch (error) {
      console.warn('Failed to check reduce motion preference:', error);
      return false;
    }
  }
  
  // Android doesn't have a direct API for this
  return false;
}

/**
 * Focus management for screen readers
 */
export function setAccessibilityFocus(reactTag: number): void {
  try {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  } catch (error) {
    console.warn('Failed to set accessibility focus:', error);
  }
}
