# Makana - Personal Clutch Companion

Clutch is the user's adaptive practice companion.

It helps users shift modes, choose the next useful move, protect energy, and build mastery over time.

Clutch should be useful before it is expressive. Personality supports practice; it does not replace practice.

---

## Product Role

Every user enters Makana with their own Clutch.

During onboarding and continued use, Clutch learns:

- current setup
- goals
- friction patterns
- preferred pace
- recovery needs
- active missions
- learning and building preferences

Clutch becomes more useful as practice creates signal. It notices what helps the user start, what drains them, what preserves momentum, and what needs to be smaller next time.

---

## What Clutch Adapts

Clutch adapts the practice, not the user's identity.

It can adjust:

- mode-aware guidance
- personalized quest suggestions
- burnout-safe pacing
- reflection prompts
- practice form recommendations
- risk checks for serious missions
- artifact reminders
- dividend reminders

Clutch should keep the mission moving one clean move at a time.

---

## Initial Fits

Fits give Clutch lightweight visual personality tied to a setup or mode.

Initial fits:

- Builder Fit
- Study Fit
- Recovery Fit
- Scout Fit
- Deep Practice Fit
- Guardrail Fit
- Dividend Fit
- Regulation Fit

Fits are not avatars, achievement skins, or identities. They are subtle visual states that help the companion feel situated.

The fox mark is Clutch's primary companion asset. Use the static PNG for compact or repeated UI, and reserve the animated GIF for roomy Clutch moments where motion can stay calm, such as the public Clutch page hero.

---

## Clutch Modes

Initial modes:

- Ignition
- Deep Practice
- Reduced Mode
- Braking
- Recovery
- Exploration
- Build Mode
- Reflection
- Scout Mode
- Lab Mode
- Review Mode
- Pilot Mode
- Guardrail Mode
- Dividend Mode
- Regulation Mode

Clutch should answer:

- What state is the user in?
- What mode fits this state?
- What is the safest useful next action?
- What practice form is being trained?
- What should be preserved for continuity?
- What risk checks matter here?
- What should adapt next time?

---

## Deterministic Policy

Clutch is deterministic-first.

The core loop is:

**Assess State -> Recommend Practice -> Execute Quest -> Capture Feedback -> Update Mastery -> Adapt Next Move**

Rules first. AI second.

Optional AI can later support mission decomposition, quest suggestions, reflection summaries, learning maps, artifact drafting, and pattern detection. The deterministic core remains explainable and usable with AI off.

---

## Burnout Safeguards

Clutch should monitor signals like:

- repeated failed starts
- sessions running too long
- skipped recovery
- high stress check-ins
- low energy over multiple days
- repeated avoidance of the same mission
- too many active quests
- vague or oversized tasks
- pressure language in reflections
- progress depending on guilt or urgency

Protective responses include Reduced Mode, Recovery Mode, smaller quests, fewer active missions, clean stopping, shorter sessions, lower difficulty, delayed escalation, and review before continuing.

Recovery counts as mastery.

---

## Responsible Missions

Serious missions need checks and balances.

Clutch can introduce:

- Benefit Check
- Harm Check
- Stakeholder Check
- Evidence Check
- Scope Check
- Regulation Check
- Dividend Check

The goal is responsible acceleration: fast enough to solve real problems, careful enough to avoid reckless harm.

---

## Implementation Boundary

The v0 onboarding flow remains minimal: orientation, one optional energy question, expectations, then Daily Check.

Personal Clutch profile capture should be introduced after trust forms, not during first entry. Each question must be skippable, one screen at a time, and tied to a clear practice benefit.

The public Clutch page can explain the companion now. Product capture and persistence should ship later through small reviewable slices.
