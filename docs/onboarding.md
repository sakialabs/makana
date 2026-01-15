# Makana — Onboarding Experience

## Core Principle

**Onboarding should not teach Makana. It should let people enter Makana.**

If onboarding feels like work, we've failed.

## What Onboarding Is NOT

- ❌ A tour
- ❌ A questionnaire
- ❌ A personality assessment
- ❌ A motivation speech
- ❌ A commitment ritual

Makana does not ask people who they are. It asks how today feels.

## Onboarding Goals (Very Precise)

By the end of onboarding, the user should:

1. Feel calm, not evaluated
2. Understand one thing: start small, stop clean
3. Land directly in Daily Check
4. Trust they can skip anything

Nothing more.

---

## v0 Onboarding Flow (Implemented)

### Context: Post-Auth, First-Run Experience

This onboarding happens **after successful authentication** (sign-up or sign-in). It is the first-run experience that welcomes users into Makana.

**Lifecycle:**
1. App Launch
2. Authentication (sign-up or sign-in) → Auth succeeds
3. **First-Run Onboarding** (this flow, happens once)
4. Normal App Usage (lands in Daily Check)

### Step 0: Zero-Friction Entry (Non-Negotiable)

**First launch options:**
- Continue with Email
- Continue with Apple / Google
- Continue without account (optional but powerful)

**Rules:**
- No copy explaining why accounts matter
- No dark patterns
- Authentication happens before onboarding

### Step 1: One-Line Orientation

**Screen copy:**
> Makana is a practice medium. You don't need motivation. Just start where you are.

**Actions:**
- Continue
- Skip

**Design:**
- No logo, no titles, just the message
- Text size: 24-32px (xl-3xl), Regular
- Generous spacing
- Theme toggle always accessible

### Step 2: One Optional Question (Skippable)

**Prompt:**
> How does today feel?

**Options (single-select):**
- Steady
- Tired
- Scattered
- Heavy
- Quiet

**Actions:**
- Back
- Skip
- Continue

**Purpose:** This feeds Reduced Mode defaults, nothing else. No explanation of what this does.

**Design:**
- Title: 32-40px (3xl-4xl), Semibold
- Options in card with clear borders
- Single-select only

### Step 3: Set Expectations (One Sentence)

**Screen copy:**
> You'll check in once a day. You'll stop cleanly. That's enough.

**Actions:**
- Back
- Begin

**Design:**
- Text size: 24-32px (xl-3xl), Regular
- Generous spacing
- No additional explanation

### Step 4: Land Directly in Daily Check

- No success screen
- No confetti
- No tutorial
- Daily Check opens immediately
- Direct redirect to `/dashboard`

---

## Implementation Status

### ✅ Complete (v0.5)

**Web:** `web/app/onboarding/page.tsx`
- Framer Motion animations (200-350ms)
- localStorage + cookies for persistence
- Middleware protection
- Theme toggle always accessible
- 3 steps: Orientation → Energy → Expectations → Daily Check

**Mobile:** `mobile/screens/OnboardingScreen.tsx`
- React Native Animated API
- AsyncStorage for persistence
- Native touch interactions
- Consistent with web design
- 3 steps: Orientation → Energy → Expectations → Daily Check

### Data Storage (Minimal)

```typescript
// Completion tracking
localStorage.setItem('makana_onboarding_completed', 'true');
document.cookie = 'makana_onboarding_completed=true; path=/; max-age=31536000';

// Energy state (optional)
localStorage.setItem('makana_initial_energy_state', 'steady'); // or null if skipped

// Skip flag
localStorage.setItem('makana_skipped_onboarding', 'true');
```

**Data Model:**
```typescript
{
  makana_onboarding_completed: boolean,
  makana_initial_energy_state: 'steady' | 'tired' | 'scattered' | 'heavy' | 'quiet' | null,
  makana_skipped_onboarding: boolean
}
```

### User Flows

**New User Journey:**
1. User signs up → Auth success
2. First login detected → Redirect to `/onboarding`
3. Step 1: Orientation → User reads, clicks Continue (or Skip)
4. Step 2: Energy Check → User selects state (or Skip)
5. Step 3: Expectations → User reads, clicks Begin
6. Immediate redirect → `/dashboard` (Daily Check)

**Returning User Journey:**
1. User signs in → Auth success
2. Onboarding completed → Middleware allows access
3. Direct to dashboard → Daily Check loads immediately

**Skip Journey:**
1. User clicks Skip → At any step
2. Flags set → `makana_onboarding_completed=true`, `makana_skipped_onboarding=true`
3. Immediate redirect → `/dashboard` (Daily Check)
4. No guilt → No negative feedback, no pressure

---

## Why This Works (Expert Reasoning)

1. **Cognitive load stays near zero** - 3 simple steps, one purpose each
2. **Users don't feel measured** - No personality tests, no goal setting
3. **Philosophy is felt, not explained** - Direct, calm language
4. **Skipping is normalized** - Skip button at every step
5. **Product teaches itself** - No tutorials, land directly in Daily Check

---

## What NOT to Add in v0

Do not add:
- Clutch explanations
- Setup selection
- Goal setting
- Streak framing
- AI introduction
- Health or vitality questions
- Notifications permissions (ask later)

All of these come later, after trust.

---

## Visual Design

### Colors (Consistent with Makana's Visual System)

- **Background**: `#f7f5f2` (Parchment) / `#121212` (Dark)
- **Surface**: `#ece9e4` (Soft Stone) / `#1A1A1A` (Dark Raised)
- **Text Primary**: `#1f1f1f` (Charcoal) / `#eaeaea` (Off-White)
- **Text Secondary**: `#5f5f5f` (Slate) / `#9a9a9a` (Cool Gray)
- **Accent**: `#2B2B2B` (Deep Belt Charcoal) / `#6A6A6A` (Charcoal Hover)
- **Border**: `#d6d2cb` (Warm Gray) / `#4A4A4A` (Charcoal Border)

### Typography

- **Orientation/Expectations**: 24-32px (xl-3xl), Regular
- **Title**: 32-40px (3xl-4xl), Semibold
- **Body**: 16px (base), Regular
- **Line Height**: 1.5-1.7 (relaxed)

### Spacing

- **Section Spacing**: 48px (3xl)
- **Element Spacing**: 16-24px (md-lg)
- **Card Padding**: 32px (xl)
- **Button Spacing**: 16px gap

### Animations

- **Duration**: 200-350ms (gentle, not jarring)
- **Easing**: ease-out for entrance, ease-in for exit
- **Types**: Fade (opacity), Slide (translateY)

### Accessibility

- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- Reduced motion respect
- Clear focus states
- Touch targets: 44x44pt minimum (mobile)

---

## Success Criteria

Onboarding is successful if:

- ✅ Users reach Daily Check in under 60 seconds
- ✅ Skip functionality works at every step
- ✅ Users land directly in Daily Check (no intermediate screens)
- ✅ Only minimal data is stored (energy state + skip flag)
- ✅ Copy matches v0 spec exactly
- ✅ Consistent behavior across web and mobile
- ✅ No one asks "what do I do next?"
- ✅ No one feels "behind" on day one

### What NOT to Measure

- ❌ "Engagement" metrics
- ❌ Completion percentages as success
- ❌ Conversion funnels
- ❌ Retention tied to onboarding length

---

## v1 Onboarding Enhancements (Future)

These are **NOT** part of initial onboarding and come 3-5 days after first use.

### 1. Gentle Setup Introduction (Sprint v1.1)

**When:** After 3-5 days of use  
**Where:** Gentle prompt in Daily Check

**Prompt:**
> You can change how Makana holds your day. These are called Setups.

**Rules:**
- Optional entry point
- Never forced
- Introduced after trust is established

### 2. Vitality Onboarding (Sprint v1.2)

**When:** After 3-5 days of use  
**Where:** Settings → Vitality (separate opt-in flow)

**Rules:**
- All questions skippable
- One screen at a time
- One insight max per week
- Never shown during initial onboarding

### 3. AI Augmentation Onboarding (Sprint v1.5)

**When:** Only after repeated use  
**Where:** Settings → AI (separate opt-in flow)

**Prompt:**
> You can ask Makana to help phrase things more gently. This is optional and off by default.

**Rules:**
- No "AI assistant" framing
- No promises of intelligence
- Explicit opt-in toggle
- Never mentioned during initial onboarding

---

## Technical Execution

### Where Onboarding Logic Lives

**Trigger condition:** `user.first_login === true`

**On completion:**
- Set `first_login = false`
- Store optional `initial_energy_state`
- Route to Daily Check

**Frontend flow:**
- Client-side navigation and state
- Framer Motion (web) / React Native Animated (mobile)
- localStorage + cookies (web) / AsyncStorage (mobile)

**Backend stores minimal state:**
- Only energy state and skip flag
- No AI calls
- No analytics beyond completion
- Privacy-first

---

## Testing Checklist

### Functional Testing

**Web:**
- [ ] All 3 steps display correctly
- [ ] Navigation works (next, back, skip)
- [ ] Energy state persists when selected
- [ ] Completion flag is set correctly
- [ ] Middleware redirects work
- [ ] Theme toggle works on all steps
- [ ] Animations are smooth
- [ ] Dark mode displays correctly
- [ ] Skip functionality works at every step
- [ ] Lands directly in Daily Check (no intermediate screen)

**Mobile:**
- [ ] All 3 steps display correctly
- [ ] Navigation works (next, back, skip)
- [ ] Energy state persists when selected
- [ ] Completion flag is set correctly
- [ ] Routing guards work
- [ ] Animations are smooth
- [ ] Skip functionality works at every step
- [ ] Lands directly in Daily Check (no intermediate screen)

### Performance Testing

- [ ] Web: Completion time < 60 seconds
- [ ] Mobile: Completion time < 60 seconds
- [ ] Web: No layout shifts or jank
- [ ] Mobile: Smooth animations on low-end devices

### Accessibility Testing

- [ ] Web: Keyboard navigation works
- [ ] Web: Screen reader announces steps
- [ ] Web: Focus states are clear
- [ ] Web: Color contrast meets WCAG AA
- [ ] Web: Reduced motion respected
- [ ] Mobile: Touch targets adequate (44x44pt)
- [ ] Mobile: Screen reader support
- [ ] Mobile: Color contrast meets WCAG AA

### Cross-Platform Consistency

- [ ] Copy is identical across web and mobile
- [ ] Visual design is consistent
- [ ] Behavior is consistent
- [ ] Data storage is consistent

---

## Maintenance

### Quarterly Review

- Measure completion time (target: < 60s)
- Track skip rates (should be common)
- Review user feedback
- Ensure copy aligns with tone guidelines

### Metrics to Monitor

- Time to Daily Check
- Skip rate per step
- Drop-off points
- First session completion rate

---

## Philosophy

Onboarding embodies Makana's core values:

- **Restraint**: Minimal steps, maximum respect
- **Clarity**: One thing per screen
- **Permission**: Skip anytime, no guilt
- **Calm**: Gentle pace, no pressure
- **Trust**: The product teaches itself

---

## Final Expert Rule (Lock This)

**Onboarding should feel like permission, not preparation.**

Makana earns trust by doing less.

---

**Implementation Date:** January 14, 2026  
**Status:** ✅ Complete (v0.5)  
**Platforms:** Web + Mobile  
**Next:** Manual testing and user validation
