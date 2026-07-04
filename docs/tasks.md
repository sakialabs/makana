# Makana - Current Status and Next Steps

## Current Status

Makana v0 is functionally complete.

Working foundation:

- Backend API endpoints for auth, daily checks, sessions, reduced mode, setups, and weekly checks
- Deterministic rules engine
- Row-level security posture
- Web client with auth, dashboard, daily check, session, braking, reduced mode, weekly check, setup, and history flows
- Mobile client with matching core functionality
- Offline support, request caching, calm error handling, accessibility, and visual polish
- Simplified first-run onboarding

This foundation should be protected while the product refresh expands the model.

---

## Active Refresh Direction

Makana is moving beyond the earlier shorthand:

**A practice medium for intentional strength**

toward the clearer product promise:

**An adaptive practice system for responsible breakthroughs**

The refresh should make the full Makana model visible before zooming into Clutch-specific UX.

North star:

Makana helps people turn ambition into practice, practice into artifacts, and artifacts into shared progress.

Product backbone:

- User State
- Setup
- Mission
- Quest
- Practice Form
- Artifact
- Reflection
- Risk Check
- Dividend Artifact
- Clutch Policy

---

## Recommended Next Focus

### 1. Finish Big-Picture Refresh Alignment

Status: In progress

Scope:

- Public home page reflects the new product direction
- About page explains the broader system, not only v0 practice
- Footer tagline aligns with the refresh
- `docs/refresh.md` captures the north star, primitives, phases, and implementation rules
- `docs/README.md` points contributors to the refresh first
- `docs/vision.md`, `docs/tone.md`, and `docs/visuals.md` stay consistent with the refresh

Verification:

- Web lint
- Web build or targeted type check
- Local visual check of home/about/clutch pages

### 2. Repo Audit for Refresh Readiness

Time: 2-4 hours

Output:

- implementation map
- missing product primitives
- frontend/backend mismatches
- outdated docs
- fragile code paths
- weak tests
- setup issues
- recommended first implementation PR

Read:

- `README.md`
- `docs/refresh.md`
- `docs/vision.md`
- `docs/design.md`
- `docs/testing.md`
- `backend/main.py`
- `backend/services/session_service.py`
- `backend/services/rules_engine.py`
- `backend/migrations/001_initial_schema.sql`
- `web/app/page.tsx`
- `web/app/dashboard/page.tsx`
- `scripts/dev.sh`
- `backend/.env.example`

### 3. Harden v0 Before New Models

Time: 4-6 hours

Tasks:

- enforce one active session per user at the database level
- replace naive UTC timestamps with timezone-aware UTC
- resolve `.env.example` mismatch
- confirm frontend/backend contract alignment
- improve calm error states where the current UX is brittle
- add targeted tests for session lifecycle, reduced mode, weekly checks, setups, and calm errors

Why:

Missions, quests, artifacts, Clutch policy, and mastery need a reliable base.

### 4. Practice Backbone Slice

Time: 1-2 reviewable PRs

First product slice:

- Mission primitive
- Quest primitive
- Artifact capture
- Reflection connection
- Dashboard structure for active setup, active mission, next quest, and recent artifacts

Rules:

- keep models simple
- avoid AI dependency
- avoid heavy onboarding
- keep every new field explainable
- preserve current v0 flows

### 5. Clutch Zoom-In

Clutch-specific UX should come after the backbone is clear.

Targets already started:

- public Clutch page refresh
- Clutch reference doc
- Clutch tone update
- Clutch fit visual guidance

Later implementation targets:

- deterministic state detection
- setup-aware recommendations
- reduced mode triggers
- recovery mode
- next step preservation
- practice form detection
- recommendation logs
- explainable decisions
- burnout risk detection
- fit selection and persistence

---

## Deferred Work

These remain useful, but are no longer the immediate top priority while the refresh is landing:

- complete mobile visual alignment across the remaining screens
- deployment and dogfooding
- broader integration tests
- contributor documentation polish
- AI augmentation
- monetization
- advanced Clutch tuning
- mission packs

---

## Quality Gates

Every refresh slice should:

- preserve v0 usability
- keep onboarding light
- avoid streaks, leaderboards, shame loops, and pressure language
- keep core behavior deterministic
- add docs when product meaning changes
- add tests when behavior changes
- produce a shippable increment
