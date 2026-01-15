/**
 * Theme Toggle Component
 * 
 * Minimal, unobtrusive theme switcher.
 * Calm interaction, no visual aggression.
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme-provider';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-[#5f5f5f] hover:text-[#1f1f1f] hover:bg-[#ece9e4] dark:text-[#9a9a9a] dark:hover:text-[#eaeaea] dark:hover:bg-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2B2B] dark:focus-visible:ring-[#4A4A4A] focus-visible:ring-offset-2"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {resolvedTheme === 'light' ? (
        <Moon size={20} aria-hidden="true" />
      ) : (
        <Sun size={20} aria-hidden="true" />
      )}
    </button>
  );
}
