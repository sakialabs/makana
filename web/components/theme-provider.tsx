/**
 * Theme Provider
 *
 * Manages light/dark theme switching for Makana.
 * Respects system preference by default, allows manual override.
 * Minimal, unobtrusive implementation.
 */

'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system';

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const resolveTheme = (theme: Theme): 'light' | 'dark' =>
  theme === 'system' ? getSystemTheme() : theme;

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = localStorage.getItem('makana-theme');
  return isTheme(stored) ? stored : 'system';
};

const getInitialResolvedTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  if (document.documentElement.classList.contains('dark')) {
    return 'dark';
  }

  if (document.documentElement.classList.contains('light')) {
    return 'light';
  }

  return resolveTheme(getInitialTheme());
};

const applyThemeClass = (resolvedTheme: 'light' | 'dark', animate: boolean) => {
  const root = document.documentElement;
  const shouldAnimate =
    animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shouldAnimate) {
    root.classList.add('theme-transitioning');
  }

  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);

  if (shouldAnimate) {
    window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 260);
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(getInitialResolvedTheme);
  const hasInitialized = useRef(false);

  // Keep the root class aligned with the pre-hydration script without re-rendering.
  useEffect(() => {
    applyThemeClass(resolvedTheme, false);
    hasInitialized.current = true;
  }, [resolvedTheme]);

  // Update resolved theme based on theme setting
  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        const nextResolvedTheme = resolveTheme(theme);
        setResolvedTheme(nextResolvedTheme);
        applyThemeClass(nextResolvedTheme, hasInitialized.current);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    const nextResolvedTheme = resolveTheme(newTheme);

    setThemeState(newTheme);
    setResolvedTheme(nextResolvedTheme);
    localStorage.setItem('makana-theme', newTheme);
    applyThemeClass(nextResolvedTheme, true);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
