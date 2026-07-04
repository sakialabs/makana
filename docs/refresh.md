# Makana Refresh - Adaptive Practice for Responsible Breakthroughs

This document captures the current product refresh direction.

Makana is an adaptive practice system for responsible breakthroughs. It helps people turn ambition into practice, practice into artifacts, and artifacts into shared progress.

---

## North Star

Makana helps users:

- learn deeply
- build useful things
- protect energy
- recover cleanly
- check risk before scaling
- create reusable artifacts
- contribute to useful work for people, society, and the planet

The refresh expands Makana from a calm v0 practice medium into a broader system for adaptive learning, meaningful missions, mastery, responsible innovation, and shared value.

---

## One-Liner

Makana helps people turn ambition into practice, practice into artifacts, and artifacts into shared progress.

---

## Product Backbone

Makana is built around these primitives:

- **User State**: current energy, focus, stress, time, momentum, and recovery needs
- **Setup**: the user's current life or work mode
- **Mission**: a meaningful project, goal, or direction
- **Quest**: the next actionable unit of progress
- **Practice Form**: a repeatable pattern that builds mastery
- **Artifact**: proof that practice became something useful
- **Reflection**: the loop that turns experience into intelligence
- **Risk Check**: safeguards for serious missions
- **Dividend Artifact**: reusable work that creates shared progress

Clutch remains the adaptive policy engine inside this system, but the product story starts with Makana.

---

## Core Loop

**Assess State -> Recommend Practice -> Execute Quest -> Create Artifact -> Reflect -> Adapt Next Move**

This loop adapts:

- quest difficulty
- task size
- learning path
- review timing
- recovery prompts
- mission steps
- risk checks
- mastery progression
- next actions

Friction is data. Repeated avoidance or failed starts should trigger better scope, clearer steps, lower force, or recovery.

---

## Mastery Model

Makana's mastery system draws from martial arts and chess.

Martial arts contributes forms, drills, repetition, discipline, sparring, ranks, recovery, and embodied practice.

Chess contributes position evaluation, openings, tempo, sacrifices, endgames, trade-offs, pattern recognition, and strategy under pressure.

Mastery domains:

- Energy Mastery
- Focus Mastery
- Strategy Mastery
- Learning Mastery
- Build Mastery
- Risk Mastery
- Contribution Mastery

Mastery should reward sustainable rhythm, strong judgment, useful artifacts, recovery returns, clean starts, clean stops, scope reduction, and responsible risk checks.

No shallow points. No empty badges. No shame-based streaks.

---

## Responsible Breakthrough Layer

Makana should help people accelerate wisely.

Some missions are personal. Some touch science, medicine, climate, education, infrastructure, policy, public life, or community systems.

When stakes are higher, Makana introduces checks:

- Benefit Check
- Harm Check
- Stakeholder Check
- Evidence Check
- Scope Check
- Regulation Check
- Dividend Check

The goal is responsible acceleration: fast enough to solve real problems, careful enough to avoid reckless harm.

---

## Global Dividend Model

A mission can create a dividend through:

- public notes
- research maps
- open-source tools
- explainers
- diagrams
- prototypes
- safety checklists
- learning paths
- policy briefs
- dataset notes
- community playbooks
- better questions

The user grows, and the world receives something reusable.

---

## Product Feel

Makana should feel:

- adaptive
- strategic
- calm
- useful
- grounded
- lightly playful
- serious when stakes are high

The experience should feel like a dojo for practice, a chessboard for decisions, and a lab for meaningful work.

Adaptive learning gives it intelligence. Missions give it direction. Artifacts give it substance. Responsible checks give it judgment. Dividends give it purpose.

---

## Refresh Execution Order

### Phase 0: Repo Audit

Compare the current implementation against the refresh direction.

Deliver:

- implementation map
- product gap list
- technical risk list
- frontend/backend mismatch list
- first reviewable PR scope

### Phase 1: Harden v0

Protect the foundation before adding new primitives.

Priorities:

- database-level enforcement for one active session per user
- timezone-aware UTC timestamps
- `.env.example` alignment
- frontend/backend contract checks
- stronger calm error states
- targeted tests around sessions, reduced mode, weekly checks, setups, and errors

### Phase 2: Makana Practice Backbone

Introduce the core product primitives in small slices.

Build:

- mission model
- quest model
- artifact capture
- reflection connection
- dashboard structure that can show current setup, active mission, next quest, and recent artifacts

### Phase 3: Clutch v1

Zoom into Clutch after the backbone is clear.

Build:

- state detection
- setup-aware recommendations
- reduced mode triggers
- recovery mode
- next step preservation
- practice form detection
- recommendation logs
- explainable decisions
- burnout risk detection

### Phase 4: Personal Clutch Companion

Add personalization after trust forms.

Build:

- fit selection
- setup capture
- goals capture
- friction pattern capture
- preferred pace capture
- recovery needs capture
- mode-aware Clutch UI

### Phase 5: Mastery and Responsible Breakthroughs

Add the higher-order differentiation.

Build:

- practice forms
- mastery domains
- endgame reviews
- responsible mission checks
- dividend artifact prompts
- curated mission packs

---

## Implementation Rules

1. Keep the system deterministic-first.
2. Make every phase shippable.
3. Treat recovery as mastery.
4. Reward judgment over volume.
5. Build artifacts, not empty activity.
6. Use risk checks for serious missions.
7. Add AI only as optional support.
8. Keep onboarding light until trust forms.
9. Keep Clutch charming, concise, and useful.
10. Preserve energy while increasing capability.
