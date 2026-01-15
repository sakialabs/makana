import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Makana Color Palette - Light Mode
        parchment: "#f7f5f2",
        "soft-stone": "#ece9e4",
        "warm-gray": "#d6d2cb",
        charcoal: "#1f1f1f",
        "muted-ash": "#5f5f5f",
        placeholder: "#9a9a9a",
        
        // Primary Accent - Deep Belt Charcoal (Identity)
        "accent": "#2B2B2B",                    // Charcoal Base
        "accent-hover": "#1B1B1B",              // Darker hover for light mode
        "accent-pressed": "#0B0B0B",            // Even darker press state
        
        // Semantic colors
        success: "#5a7a5f",
        "success-light": "#c5d4c7",
        warning: "#9a7a4a",
        "warning-light": "#d4c5a5",
        error: "#a5544a",
        "error-light": "#d4a5a0",
        
        // Disabled (both modes)
        disabled: "#5a5a5a",
        
        // Dark Mode - Complete Color System
        "dark-surface": "#121212",               // Dark Surface
        "dark-raised": "#1A1A1A",                // Dark Raised Surface
        "charcoal-base": "#2B2B2B",              // Charcoal Base (identity)
        "charcoal-border": "#4A4A4A",            // Charcoal Border
        "charcoal-hover-border": "#6A6A6A",      // Charcoal Hover Border
        "off-white": "#eaeaea",                  // Dark mode text
        "cool-gray": "#9a9a9a",                  // Dark mode muted text
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.2" }],
        "2xl": ["1.5rem", { lineHeight: "1.2" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "6rem",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        md: "0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        lg: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
      },
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "200ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
