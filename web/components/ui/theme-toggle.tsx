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
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-[4.25rem] flex-shrink-0 items-center rounded-full border border-[#d6d2cb] bg-[#ece9e4] p-1 text-[#5f5f5f] transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2B2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f5f2] dark:border-[#4A4A4A] dark:bg-[#1A1A1A] dark:text-[#eaeaea] dark:hover:border-[#6A6A6A] dark:focus-visible:ring-[#6A6A6A] dark:focus-visible:ring-offset-[#121212]"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-checked={isDark}
      role="switch"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2 text-[#9a9a9a] transition-colors duration-300 dark:text-[#eaeaea]"
      >
        <Sun size={14} />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 text-[#5f5f5f] transition-colors duration-300 dark:text-[#9a9a9a]"
      >
        <Moon size={14} />
      </span>
      <span
        aria-hidden="true"
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#f7f5f2] text-[#1f1f1f] shadow-sm ring-1 ring-[#d6d2cb] transition-[transform,background-color,color,box-shadow] duration-300 ease-out dark:bg-[#2B2B2B] dark:text-[#eaeaea] dark:ring-[#4A4A4A] ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  );
}
