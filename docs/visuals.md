# Makana — Visual Design Guidelines

This document defines the visual system for **Makana**, across web and mobile.

Makana is a **practice medium** centered on intentional strength, alignment, and restraint.  
The visual design must support focus, reduce cognitive load, and protect user energy.

Design choices should feel calm, deliberate, and durable.

---

## 1. Design Principles

All visual decisions should follow these principles:

- Restraint over expression
- Clarity over decoration
- Calm over stimulation
- Consistency over novelty
- Silence as a feature

If a visual element does not support use, remove it.

---

## 2. Color System

Makana uses a **neutral-first palette** with a **single accent color**.  
Color is functional, not decorative.

### 2.1 Core Neutrals (Light Mode)

| Purpose        | Color Name        | Hex       | CSS Variable          |
|---------------|-------------------|-----------|-----------------------|
| Background     | Parchment         | `#F7F5F2` | `--color-parchment`   |
| Surface        | Soft Stone        | `#ECE9E4` | `--color-soft-stone`  |
| Border / Line  | Warm Gray         | `#D6D2CB` | `--color-warm-gray`   |
| Primary Text   | Charcoal          | `#1F1F1F` | `--color-charcoal`    |
| Secondary Text | Muted Ash         | `#5F5F5F` | `--color-muted-ash`   |

Rules:
- Never use pure white (`#FFFFFF`)
- Text contrast must meet WCAG AA minimums

---

### 2.2 Core Neutrals (Dark Mode)

| Purpose        | Color Name        | Hex       | CSS Variable            |
|---------------|-------------------|-----------|-------------------------|
| Background     | Deep Charcoal     | `#121212` | `--color-deep-charcoal` |
| Surface        | Graphite          | `#1C1C1C` | `--color-graphite`      |
| Border / Line  | Soft Slate        | `#2A2A2A` | `--color-soft-slate`    |
| Primary Text   | Off-White         | `#EAEAEA` | `--color-off-white`     |
| Secondary Text | Cool Gray         | `#9A9A9A` | `--color-cool-gray`     |

Rules:
- Avoid high-contrast pure black
- Dark mode should feel restful, not dramatic

**Form Inputs & Text Fields:**
- Light Mode: Use Surface color (`#ECE9E4` Soft Stone) - creates gentle elevation from background
- Dark Mode: Use Background color (`#121212` Dark Surface) - maintains consistency with page, relies on border for definition
- Both modes use clear borders (`#D6D2CB` Warm Gray / `#4A4A4A` Charcoal Border) to define input areas
- This pattern applies to all text inputs, textareas, and form fields globally

---

### 2.3 Accent Color (Single, Shared)

Makana uses **one accent color** across the entire app.

**Primary Accent: Deep Belt Charcoal**  
- Hex: `#2B2B2B`
- CSS Variable: `--color-accent`
- Hover: `#3B3B3B` (lighter for visibility)
- Pressed: `#1B1B1B` (darker for feedback)

Usage:
- Primary actions
- Active states
- Selected options
- Focus indicators

Rules:
- Never more than one accent color per screen
- Never use accent color for decoration
- Do not animate accent color aggressively
- In dark mode, hover states must be lighter (not darker) for visibility

Accent color represents **intention and engagement**.

---

### 2.4 Dark Mode Enhanced Colors

Dark mode uses a refined charcoal-based system for better contrast and visibility:

| Purpose                | Color Name              | Hex       | CSS Variable                  |
|-----------------------|-------------------------|-----------|-------------------------------|
| Accent Base           | Charcoal Base           | `#2B2B2B` | `--color-accent`              |
| Background            | Dark Surface            | `#121212` | `--color-deep-charcoal`       |
| Raised Surface        | Dark Raised Surface     | `#1A1A1A` | `--color-dark-raised`         |
| Border                | Charcoal Border         | `#4A4A4A` | `--color-charcoal-border`     |
| Hover Border          | Charcoal Hover Border   | `#6A6A6A` | `--color-charcoal-hover`      |
| Disabled              | Disabled Gray           | `#5A5A5A` | `--color-disabled`            |

Rules:
- Use `#1A1A1A` for cards and elevated surfaces in dark mode
- Use `#4A4A4A` for borders to ensure visibility
- Use `#6A6A6A` for hover states and focus rings
- Links must use `#eaeaea` (off-white) in dark mode for visibility
- Never use dark accent colors for links in dark mode

---

### 2.5 Semantic Colors (Limited)

Semantic colors are used sparingly and never dominate a screen.

| Purpose   | Hex       | CSS Variable       |
|-----------|-----------|-------------------|
| Success   | `#5E8C6A` | `--color-success` |
| Warning   | `#C2A14D` | `--color-warning` |
| Error     | `#A5544A` | `--color-error`   |

Rules:
- No bright reds or greens
- No success confetti or celebration effects
- Semantic feedback should be calm and informational

---

## Implementation Notes

### Web Client (Next.js + Tailwind CSS v4)

Colors are defined in `web/app/globals.css` using CSS custom properties within the `@theme` directive:

```css
@theme {
  --color-parchment: #f7f5f2;
  --color-deep-olive: #4f6a5a;
  /* ... other colors */
}
```

Components use Tailwind's bracket notation to reference colors:
- `bg-[#f7f5f2]` for Parchment background
- `text-[#4f6a5a]` for Deep Olive text
- `border-[#d6d2cb]` for Warm Gray borders

### Framer Motion Integration

Smooth transitions are implemented using Framer Motion:
- Button tap animations: `whileTap={{ scale: 0.98 }}`
- Card entrance animations: `initial={{ opacity: 0, y: 10 }}`
- Transition duration: 150-350ms (gentle, not jarring)

### Component Library

UI primitives built with:
- `class-variance-authority` for variant management
- `clsx` + `tailwind-merge` for className composition
- Framer Motion for smooth animations
- Lucide React for icons

---

## 3. Typography

Typography should feel human, legible, and calm.

### 3.1 Typeface Direction

Preferred categories:
- Humanist sans-serif
- Modern serif with low contrast

Avoid:
- Ultra-geometric fonts
- Playful rounded fonts
- Decorative or novelty fonts

Typography should age well.

---

### 3.2 Typography Rules

- Headings: restrained weight, no shouting
- Body text: generous line height (1.5–1.7)
- Small text: never below accessibility thresholds
- No ALL CAPS in body content

Typography should feel like **good paper**, not marketing copy.

---

## 4. Layout & Spacing

### 4.1 Layout Principles

- One primary action per screen
- Clear vertical hierarchy
- No dense dashboards
- No information walls

Makana screens should feel breathable.

---

### 4.2 Spacing

- Consistent spacing scale
- Generous margins
- Clear separation between sections

If a screen feels crowded, it is incorrect.

---

## 5. Motion & Animation

Motion is used only to:
- indicate state change
- reinforce timing
- reduce uncertainty

Allowed:
- gentle fades
- slow slides
- natural easing

Avoid:
- bounce effects
- elastic motion
- attention-seeking animation

Motion should feel like **breathing**, not stimulation.

---

## 6. Clutch Visual Language

Clutch is expressed visually, not announced.

Clutch appears through:
- reduced opacity
- disabled or softened actions
- slowed transitions
- subtle resistance to interaction

Clutch does not:
- interrupt the user
- demand attention
- add visual noise

Alignment should be **felt**, not explained.

---

## 7. Setups Visual Treatment

Setups are **lenses**, not identities.

Rules:
- No avatars
- No achievement skins
- No identity colors

A Setup may subtly affect:
- pacing
- emphasis
- default states

The change should be perceptible without being explicit.

---

## 8. Gamification Visuals

Makana gamifies **practice**, not performance.

Allowed:
- subtle indicators
- quiet acknowledgements
- form recognition

Not allowed:
- streak counters
- leaderboards
- badges
- confetti
- fireworks

Progress should feel internal and steady.

---

## 9. Icons & Emojis

### Icons
- Simple outline icons
- Consistent stroke weight
- Functional only

### Emojis
- Allowed in documentation and onboarding
- Not used in core UI
- Never used as buttons or controls

---

## 10. Platform Considerations

### Web
- Slightly denser layouts allowed
- Wider margins
- Keyboard-friendly navigation

### Mobile
- Thumb-first interaction
- Fewer actions per screen
- Larger touch targets
- Slower, gentler transitions

Mobile should feel calmer than web.

---

## 11. Accessibility

Accessibility is non-negotiable.

- WCAG-compliant contrast
- Clear focus states
- Reduced motion option
- Readable default text sizes

Respect includes accessibility.

---

## 12. Visual Design Checklist (Before Shipping)

- Does this reduce cognitive load?
- Does this respect silence?
- Does this avoid visual pressure?
- Does this feel durable in 5 years?
- Can something be removed?

If unsure, remove it.

---

## Closing

Makana’s visual system should feel like:

- a calm studio
- a focused training space
- a medium that supports practice

If the interface tries to impress, it has failed.

Restraint is the design.
