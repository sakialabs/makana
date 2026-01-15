# Design Document: Makana v0 Foundation

## Overview

Makana v0 Foundation establishes the core practice medium for intentional strength development. The system enables users to start sessions (Ignition), stop cleanly (Braking), check in daily and weekly, and adapt to capacity through Reduced Mode. The architecture prioritizes deterministic behavior, cross-platform consistency, calm UX, and privacy-first data handling.

This design covers the full stack: Next.js web client, Expo mobile client, FastAPI backend, and Supabase (Postgres + Auth + RLS). All core functionality operates without AI, using explicit rules and state machines. The system is built for longevity, not urgency, with stability as a feature.

Makana treats living as a practice, not a performance. Progress is recognized through forms (clean starts, clean stops, continuity), not metrics. The tool adapts to human energy instead of demanding consistency.

## Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Client Layer                          │
│                                                           │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │   Web Client    │         │  Mobile Client  │          │
│  │   (Next.js)     │         │     (Expo)      │          │
│  │                 │         │                 │          │
│  │  - React Query  │         │  - React Query  │          │
│  │  - Offline Queue│         │  - Offline Queue│          │
│  │  - Local Storage│         │  - AsyncStorage │          │
│  │  - fast-check   │         │  - fast-check   │          │
│  └────────┬────────┘         └────────┬────────┘          │
│           │                           │                   │
└───────────┼───────────────────────────┼───────────────────┘
            │                           │
            │      HTTPS/JSON API       │
            │      (JWT Auth)           │
            └───────────┬───────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│                   Backend Layer                            │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              FastAPI Application                     │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │   Auth   │  │ Session  │  │  Rules   │            │  │
│  │  │ Service  │  │ Service  │  │  Engine  │            │  │
│  │  └──────────┘  └──────────┘  └──────────┘            │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │  Daily   │  │  Weekly  │  │ Reduced  │            │  │
│  │  │  Check   │  │  Check   │  │   Mode   │            │  │
│  │  └──────────┘  └──────────┘  └──────────┘            │  │
│  │                                                      │  │
│  │  ┌──────────┐                                        │  │
│  │  │  Setup   │                                        │  │
│  │  │ Service  │                                        │  │
│  │  └──────────┘                                        │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                    │
└───────────────────────┼────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   Data Layer                                │
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │  Supabase Auth  │         │    Postgres     │            │
│  │                 │         │                 │            │
│  │  - JWT Tokens   │         │  - User Data    │            │
│  │  - User Mgmt    │         │  - RLS Policies │            │
│  └─────────────────┘         └─────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```


### Technology Stack

**Frontend:**
- **Web**: Next.js 14+ (App Router), TypeScript, React Query for state management
- **Mobile**: Expo (React Native), TypeScript, React Query for state management
- **Shared**: UI primitives, data models, API contracts, design system
- **Testing**: fast-check for property-based testing, Vitest/Jest for unit tests

**Backend:**
- **API**: Python 3.11+, FastAPI for REST API, Pydantic for validation
- **Database**: Supabase Postgres with Row-Level Security (RLS)
- **Authentication**: Supabase Auth (JWT-based tokens)
- **Testing**: Hypothesis for property-based testing, pytest for unit tests

**Infrastructure:**
- **Web Hosting**: Vercel (serverless, edge-optimized)
- **Mobile Distribution**: App Store (iOS), Play Store (Android)
- **Backend Hosting**: Railway or Fly.io (containerized deployment)
- **Database**: Supabase (managed Postgres with built-in Auth and RLS)
- **Monitoring**: Structured logging (JSON format), error tracking (Sentry or similar)

### Design Principles

1. **Deterministic First**: All core logic uses explicit rules, no AI required for functionality
2. **Offline Resilient**: Clients queue changes when offline, sync automatically when connected
3. **Privacy by Design**: Minimal data collection, RLS enforcement, no third-party sharing
4. **Calm by Default**: One primary action per screen, generous spacing, restrained feedback
5. **Cross-Platform Consistency**: Shared data models, API contracts, and business logic
6. **Respect for Energy**: System adapts to user capacity, never demands consistency
7. **Silence as Feature**: Over-communication is noise, silence is respect
8. **Continuity Over Intensity**: Support long-term practice, not short-term performance
9. **Stability Over Novelty**: Core features don't change often, durability is valued
10. **Restraint Over Engagement**: Simplicity and focus over feature richness

## Components and Interfaces

### Backend API Components

#### 1. Authentication Service
**Responsibility**: Verify Supabase JWT tokens, provision user profiles, manage session lifecycle

**Key Functions**:
- `verify_token(token: str) -> User`: Validate JWT signature and expiration, return user object
- `create_user_profile(user_id: str, email: str) -> UserProfile`: Initialize user record on first auth
- `refresh_token(refresh_token: str) -> TokenPair`: Issue new access token from refresh token
- `get_user_by_id(user_id: str) -> User`: Retrieve user profile by ID

**Dependencies**: Supabase Auth client, JWT library

**Error Handling**: Invalid tokens return 401 Unauthorized with calm message

#### 2. Daily Check Service
**Responsibility**: Manage daily check-in records, enforce one-per-day constraint

**Key Functions**:
- `create_daily_check(user_id: str, responses: dict) -> DailyCheck`: Store check-in with timestamp
- `get_today_check(user_id: str, date: date) -> Optional[DailyCheck]`: Retrieve today's check if exists
- `has_completed_today(user_id: str) -> bool`: Check if today's check exists (fast query)
- `get_check_history(user_id: str, limit: int) -> List[DailyCheck]`: Retrieve past checks

**Dependencies**: Database connection, date utilities

**Error Handling**: Duplicate check attempts return 409 Conflict with calm message


#### 3. Session Service
**Responsibility**: Manage Ignition/Braking lifecycle, prevent concurrent sessions, track history

**Key Functions**:
- `start_session(user_id: str, setup_id: str) -> Session`: Create active session with start timestamp
- `end_session(session_id: str, next_step: str) -> Session`: Complete session, calculate duration, store next step
- `get_active_session(user_id: str) -> Optional[Session]`: Find active session for user (at most one)
- `abandon_session(session_id: str) -> Session`: Mark session as abandoned without penalty
- `get_recent_sessions(user_id: str, limit: int) -> List[Session]`: Retrieve history in reverse chronological order

**Dependencies**: Database connection, Rules Engine (for duration calculation), Reduced Mode Service

**Error Handling**: Concurrent session attempts return 409 Conflict with calm message

#### 4. Reduced Mode Service
**Responsibility**: Manage capacity-aware state, adjust session parameters

**Key Functions**:
- `activate_reduced_mode(user_id: str) -> ReducedModeState`: Enable reduced mode, record activation timestamp
- `deactivate_reduced_mode(user_id: str) -> ReducedModeState`: Disable reduced mode, record deactivation timestamp
- `get_reduced_mode_state(user_id: str) -> ReducedModeState`: Check current state (active/inactive)
- `apply_reduced_constraints(session_params: dict) -> dict`: Adjust session duration to 60% of default

**Dependencies**: Database connection

**Error Handling**: State transitions are idempotent (activating when active is no-op)

#### 5. Weekly Check Service
**Responsibility**: Manage weekly reflection, generate insights, recommend scope adjustments

**Key Functions**:
- `create_weekly_check(user_id: str, responses: dict) -> WeeklyCheck`: Store review with timestamp
- `generate_insight(user_id: str, week_data: dict) -> Optional[str]`: Produce at most one insight
- `recommend_scope_adjustment(week_data: dict) -> Optional[str]`: Suggest Reduced Mode if needed
- `get_week_data(user_id: str, week_start: date, week_end: date) -> dict`: Aggregate week statistics

**Dependencies**: Database connection, Rules Engine (for insight generation)

**Error Handling**: Missing data returns empty insights without error

#### 6. Setup Service
**Responsibility**: Manage preset configurations, apply defaults to sessions

**Key Functions**:
- `get_available_setups() -> List[Setup]`: Return preset setups (Calm, Reduced, Vitality)
- `activate_setup(user_id: str, setup_id: str) -> UserSetup`: Apply setup to user, record activation
- `get_active_setup(user_id: str) -> Setup`: Retrieve current setup for user
- `get_setup_defaults(setup_id: str) -> dict`: Return default parameters (duration, emphasis)

**Dependencies**: Database connection (setups are seeded data)

**Error Handling**: Invalid setup IDs return 404 Not Found with calm message

#### 7. Rules Engine
**Responsibility**: Deterministic decision logic for duration, recommendations, insights

**Key Functions**:
- `calculate_session_duration(setup: Setup, reduced_mode: bool) -> int`: Determine minutes (25 default, 15 reduced)
- `should_recommend_reduced_mode(week_data: dict) -> bool`: Evaluate capacity signals (<50% completion or <3 daily checks)
- `generate_insight(user_id: str, week_data: dict) -> Optional[str]`: Produce at most one insight based on patterns

**Dependencies**: None (pure functions)

**Error Handling**: Invalid inputs raise ValueError with clear message


### Frontend Components (Shared Patterns)

#### 1. Authentication Flow
- **Sign In Screen**: Email/password form, calm error handling, secure token storage
- **Sign Up Screen**: Email/password form, validation feedback, account creation
- **Password Reset Screen**: Email input, reset link request (future enhancement)

#### 2. Daily Check Flow
- **Daily Check Screen**: Prompts display, response capture, submit button (one primary action)
- **Daily Check Confirmation Screen**: Calm acknowledgment, return to home
- **Daily Check History**: Past checks list, dates, responses (no metrics)

#### 3. Session Flow
- **Ignition Screen**: Start button (one primary action), setup display, reduced mode indicator
- **Active Session Screen**: Timer display, minimal interface, pause/stop actions
- **Braking Screen**: Next step capture (text input), completion button, calm confirmation

#### 4. Weekly Check Flow
- **Weekly Check Screen**: Reflection prompt, capacity question, response capture
- **Weekly Check Insight Screen**: Optional insight display (at most one), scope recommendation, Reduced Mode activation option

#### 5. Setup Management
- **Setup Selector Screen**: Preset list (Calm, Reduced, Vitality), descriptions, selection
- **Active Setup Display**: Persistent indicator showing current setup name

#### 6. History View
- **Recent Sessions List**: Dates, durations, next steps, reverse chronological order
- **Calm Empty State**: Invitational message when no sessions exist (no pressure)

### API Endpoints

#### Authentication
```
POST   /api/v1/auth/signup          Create account (email, password)
POST   /api/v1/auth/signin          Authenticate user (email, password)
POST   /api/v1/auth/refresh         Refresh access token (refresh_token)
```

#### Daily Check
```
POST   /api/v1/daily-check          Create daily check-in (responses)
GET    /api/v1/daily-check/today    Get today's check (if exists)
GET    /api/v1/daily-check/history  Get past checks (limit, offset)
```

#### Sessions
```
POST   /api/v1/sessions             Start session - Ignition (setup_id)
PATCH  /api/v1/sessions/{id}/end    End session - Braking (next_step)
PATCH  /api/v1/sessions/{id}/abandon Abandon session (no penalty)
GET    /api/v1/sessions/active      Get active session (if exists)
GET    /api/v1/sessions/recent      Get recent sessions (limit, offset)
```

#### Reduced Mode
```
POST   /api/v1/reduced-mode/activate   Enable reduced mode
POST   /api/v1/reduced-mode/deactivate Disable reduced mode
GET    /api/v1/reduced-mode/status     Get current state (active/inactive)
```

#### Weekly Check
```
POST   /api/v1/weekly-check         Create weekly review (responses)
GET    /api/v1/weekly-check/latest  Get most recent review
GET    /api/v1/weekly-check/history Get past reviews (limit, offset)
```

#### Setups
```
GET    /api/v1/setups               List available setups (presets)
POST   /api/v1/setups/activate      Activate a setup (setup_id)
GET    /api/v1/setups/active        Get current setup
```


## Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;              // UUID, primary key
  email: string;           // From Supabase Auth, unique
  created_at: timestamp;   // Account creation time
  updated_at: timestamp;   // Last profile update
}
```

### Setup (Preset Configuration)
```typescript
interface Setup {
  id: string;              // UUID, primary key
  name: string;            // "Calm", "Reduced", "Vitality"
  description: string;     // Brief explanation of setup purpose
  default_session_duration: number;  // minutes (25 for Calm, 15 for Reduced, 30 for Vitality)
  emphasis: string;        // "rest", "continuity", "health"
  is_preset: boolean;      // true for v0 (all are presets)
  created_at: timestamp;   // Setup creation time
}
```

**Preset Setups**:
- **Calm**: Default 25 minutes, emphasis on "rest", for balanced practice
- **Reduced**: Default 15 minutes, emphasis on "continuity", for low-capacity periods
- **Vitality**: Default 30 minutes, emphasis on "health", for energy-focused practice

### User Setup (Active Configuration)
```typescript
interface UserSetup {
  id: string;              // UUID, primary key
  user_id: string;         // FK to UserProfile
  setup_id: string;        // FK to Setup
  activated_at: timestamp; // When this setup was activated
}
```

**Note**: Users can switch setups freely. Historical sessions retain their original setup_id (immutability).

### Daily Check
```typescript
interface DailyCheck {
  id: string;              // UUID, primary key
  user_id: string;         // FK to UserProfile
  check_date: date;        // Calendar date (YYYY-MM-DD)
  responses: jsonb;        // Flexible check-in data (energy_level, intention, etc.)
  completed_at: timestamp; // When check was completed
  created_at: timestamp;   // Record creation time
}
```

**Unique Constraint**: (user_id, check_date) - one check per day per user

### Session
```typescript
interface Session {
  id: string;              // UUID, primary key
  user_id: string;         // FK to UserProfile
  setup_id: string;        // FK to Setup (snapshot at start, immutable)
  start_time: timestamp;   // Session start (Ignition)
  end_time: timestamp | null;  // Session end (Braking), null if active
  duration_minutes: number | null;  // Calculated: (end_time - start_time) in minutes
  next_step: string | null;  // Captured during Braking, optional
  status: 'active' | 'completed' | 'abandoned';  // Session state
  reduced_mode_active: boolean;  // Was reduced mode active at start?
  created_at: timestamp;   // Record creation time
  updated_at: timestamp;   // Last update time
}
```

**Business Rules**:
- At most one active session per user at any time
- Duration is calculated on end, not stored separately
- Next step is optional (user can skip)
- Abandoned sessions have no penalty or negative feedback

### Weekly Check
```typescript
interface WeeklyCheck {
  id: string;              // UUID, primary key
  user_id: string;         // FK to UserProfile
  week_start_date: date;   // Monday of the week (YYYY-MM-DD)
  week_end_date: date;     // Sunday of the week (YYYY-MM-DD)
  responses: jsonb;        // Reflection data (capacity, experience, etc.)
  insight: string | null;  // At most one insight, generated by Rules Engine
  scope_recommendation: string | null;  // Reduced Mode suggestion if applicable
  completed_at: timestamp; // When review was completed
  created_at: timestamp;   // Record creation time
}
```

**Business Rules**:
- Insight is at most one sentence, or null if nothing notable
- Scope recommendation suggests Reduced Mode if capacity signals are low

### Reduced Mode State
```typescript
interface ReducedModeState {
  id: string;              // UUID, primary key
  user_id: string;         // FK to UserProfile (unique)
  is_active: boolean;      // Current state (true = reduced mode on)
  activated_at: timestamp | null;  // When reduced mode was last activated
  deactivated_at: timestamp | null;  // When reduced mode was last deactivated
  created_at: timestamp;   // Record creation time
  updated_at: timestamp;   // Last update time
}
```

**Business Rules**:
- One record per user (unique constraint on user_id)
- Toggling is idempotent (activating when active is no-op)
- State affects session duration calculation


### Database Relationships

```
UserProfile (1) ──< (many) DailyCheck
UserProfile (1) ──< (many) Session
UserProfile (1) ──< (many) WeeklyCheck
UserProfile (1) ──< (1) ReducedModeState
UserProfile (1) ──< (many) UserSetup
Setup (1) ──< (many) UserSetup
Setup (1) ──< (many) Session (snapshot, immutable)
```

### Row-Level Security (RLS) Policies

All user-owned tables enforce RLS to prevent cross-user access:

```sql
-- Example for sessions table
CREATE POLICY "Users can only access their own sessions"
  ON sessions
  FOR ALL
  USING (auth.uid() = user_id);

-- Applied to all tables:
-- daily_checks, sessions, weekly_checks, reduced_mode_states, user_setups
```

**Security Guarantees**:
- Users can only read/write their own data
- Database enforces isolation at row level
- Even compromised application code cannot bypass RLS
- Supabase Auth provides auth.uid() context automatically

### Database Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX idx_daily_checks_user_date ON daily_checks(user_id, check_date);
CREATE INDEX idx_sessions_user_status ON sessions(user_id, status);
CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);
CREATE INDEX idx_weekly_checks_user_week ON weekly_checks(user_id, week_start_date);
CREATE INDEX idx_user_setups_user_activated ON user_setups(user_id, activated_at DESC);
CREATE INDEX idx_reduced_mode_user ON reduced_mode_states(user_id);
```

## Core Logic

### Session Duration Calculation

```python
def calculate_session_duration(setup: Setup, reduced_mode: bool) -> int:
    """
    Determine session duration in minutes based on setup and reduced mode.
    
    Args:
        setup: The active setup configuration
        reduced_mode: Whether reduced mode is currently active
        
    Returns:
        Session duration in minutes
        
    Examples:
        >>> setup = Setup(default_session_duration=25)
        >>> calculate_session_duration(setup, False)
        25
        >>> calculate_session_duration(setup, True)
        15  # 25 * 0.6 = 15
    """
    base_duration = setup.default_session_duration
    
    if reduced_mode:
        # Reduce by 40% (to 60% of default) in reduced mode
        return int(base_duration * 0.6)
    
    return base_duration
```

**Design Rationale**: 40% reduction (to 60%) is significant enough to feel different but not so extreme that sessions become ineffective. This can be tuned based on dogfooding feedback.

### Reduced Mode Recommendation Logic

```python
def should_recommend_reduced_mode(week_data: dict) -> bool:
    """
    Evaluate if user should activate reduced mode based on week data.
    
    Args:
        week_data: Dictionary containing:
            - sessions_completed: int (number of completed sessions)
            - sessions_abandoned: int (number of abandoned sessions)
            - daily_checks_completed: int (number of daily checks)
            
    Returns:
        True if reduced mode should be recommended, False otherwise
        
    Examples:
        >>> should_recommend_reduced_mode({
        ...     'sessions_completed': 2,
        ...     'sessions_abandoned': 5,
        ...     'daily_checks_completed': 2
        ... })
        True  # Low completion rate (2/7 = 28%)
        
        >>> should_recommend_reduced_mode({
        ...     'sessions_completed': 5,
        ...     'sessions_abandoned': 1,
        ...     'daily_checks_completed': 6
        ... })
        False  # Good completion rate (5/6 = 83%)
    """
    sessions_completed = week_data.get('sessions_completed', 0)
    sessions_abandoned = week_data.get('sessions_abandoned', 0)
    daily_checks_completed = week_data.get('daily_checks_completed', 0)
    
    # Recommend if completion rate is low (< 50%)
    total_sessions = sessions_completed + sessions_abandoned
    if total_sessions > 0:
        completion_rate = sessions_completed / total_sessions
        if completion_rate < 0.5:
            return True
    
    # Recommend if daily check engagement is low (< 3 per week)
    if daily_checks_completed < 3:
        return True
    
    return False
```

**Design Rationale**: Low completion rate or low daily check engagement signals capacity issues. Reduced Mode helps maintain continuity during difficult periods.


### Weekly Insight Generation

```python
def generate_insight(user_id: str, week_data: dict) -> Optional[str]:
    """
    Generate at most one insight from week data.
    
    Args:
        user_id: User identifier (for future personalization)
        week_data: Dictionary containing:
            - sessions_completed: int
            - sessions_with_next_step: int (sessions where next_step was captured)
            
    Returns:
        One insight string or None if nothing notable
        
    Examples:
        >>> generate_insight('user123', {
        ...     'sessions_completed': 5,
        ...     'sessions_with_next_step': 4
        ... })
        'Clean stops this week.'
        
        >>> generate_insight('user123', {
        ...     'sessions_completed': 1,
        ...     'sessions_with_next_step': 0
        ... })
        None  # Nothing notable
    """
    sessions_completed = week_data.get('sessions_completed', 0)
    clean_stops = week_data.get('sessions_with_next_step', 0)
    
    # Recognize clean stopping practice (80%+ of sessions have next step)
    if sessions_completed > 0:
        clean_stop_rate = clean_stops / sessions_completed
        if clean_stop_rate >= 0.8:
            return "Clean stops this week."
    
    # Recognize continuity (4+ sessions in a week)
    if sessions_completed >= 4:
        return "Continuity maintained."
    
    # No insight if nothing notable
    return None
```

**Design Rationale**: Insights are rare and meaningful. They recognize practice forms (clean stops, continuity), not output. At most one insight per week prevents noise.

### Concurrent Session Prevention

```python
def start_session(user_id: str, setup_id: str) -> Session:
    """
    Start a new session, preventing concurrent sessions.
    
    Args:
        user_id: User identifier
        setup_id: Setup identifier
        
    Returns:
        Created session object
        
    Raises:
        ConflictError: If active session already exists for user
        
    Examples:
        >>> start_session('user123', 'setup_calm')
        Session(id='sess123', status='active', ...)
        
        >>> start_session('user123', 'setup_calm')  # While session active
        ConflictError: "Unable to start right now. Try again in a moment."
    """
    # Check for existing active session
    active_session = get_active_session(user_id)
    
    if active_session:
        raise ConflictError(
            code="CONCURRENT_SESSION",
            message="Unable to start right now. Try again in a moment."
        )
    
    # Get reduced mode state
    reduced_mode_state = get_reduced_mode_state(user_id)
    
    # Get setup for duration calculation
    setup = get_setup_by_id(setup_id)
    
    # Calculate duration based on setup and reduced mode
    duration = calculate_session_duration(setup, reduced_mode_state.is_active)
    
    # Create new session
    session = Session(
        user_id=user_id,
        setup_id=setup_id,
        start_time=datetime.utcnow(),
        status='active',
        reduced_mode_active=reduced_mode_state.is_active,
        duration_minutes=duration
    )
    
    # Persist to database
    db.save(session)
    
    return session
```

**Design Rationale**: One active session per user prevents confusion and maintains focus. Calm error message respects user without blame.


## Clutch Model (v0 Minimal)

Clutch in v0 is minimal and deterministic. It influences session duration and scope based on Reduced Mode state. Full Clutch state machine (Idle, Engaging, Holding, Limiting, Releasing, Recovering) is planned for v1.

### Clutch State (v0)

```python
class ClutchState(Enum):
    IDLE = "idle"           # No active session
    ENGAGING = "engaging"   # Session starting
    HOLDING = "holding"     # Session active, normal mode
    LIMITING = "limiting"   # Reduced mode active, force limited
```

### Clutch Behavior (v0)

- **IDLE**: No influence, user can start session freely
- **ENGAGING**: Session begins, duration calculated based on setup and reduced mode
- **HOLDING**: Session proceeds normally with full duration
- **LIMITING**: Reduced mode active, session duration reduced to 60%, prompts simplified

**Important**: Clutch does not speak in v0. It adjusts parameters silently. No prompts, no commentary, no over-communication. Alignment is felt through adjusted conditions, not announced.

### State Transitions (v0)

```
IDLE → ENGAGING (user starts session)
ENGAGING → HOLDING (session active, normal mode)
ENGAGING → LIMITING (session active, reduced mode)
HOLDING → IDLE (session ends)
LIMITING → IDLE (session ends)
HOLDING ↔ LIMITING (reduced mode toggled during session)
```

**v1 Enhancement**: Full state machine with Releasing (gentle disengagement) and Recovering (post-session state) will be added based on dogfooding feedback.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property-based testing validates these properties across many generated inputs, catching edge cases that unit tests might miss. Each property is tested with at least 100 iterations using randomized inputs.

### Authentication and Authorization Properties

**Property 1: User account creation succeeds for valid credentials**
*For any* valid email and password combination (email format valid, password length >= 8), creating a user account should succeed and the account should be retrievable by email.
**Validates: Requirements 1.1**

**Property 2: Authentication produces valid tokens**
*For any* registered user with correct credentials, signing in should produce a valid session token that grants access to protected resources and can be verified successfully.
**Validates: Requirements 1.2, 1.3**

**Property 3: Row-level security prevents cross-user access**
*For any* two distinct users A and B, user A should not be able to access user B's data (sessions, daily checks, weekly checks, or reduced mode state) through any API endpoint or database query.
**Validates: Requirements 1.4, 12.4**

**Property 4: Session expiration requires re-authentication without data loss**
*For any* expired session token, attempting to access protected resources should require re-authentication, and all user data should remain intact and accessible after successful re-authentication.
**Validates: Requirements 1.5**

### Daily Check Properties

**Property 5: Daily check responses are persisted correctly**
*For any* daily check responses submitted by a user, the responses should be stored in the database and retrievable with the correct timestamp and user_id.
**Validates: Requirements 2.2, 2.3**

**Property 6: One daily check per calendar day**
*For any* user and calendar date, there should be at most one daily check record, and attempting to create a second check for the same date should be prevented with a calm error message.
**Validates: Requirements 2.4, 2.5**

### Session Properties

**Property 7: Session creation records start timestamp**
*For any* ignition action, a new session should be created with a start timestamp that is within 1 second of the action time.
**Validates: Requirements 3.1**

**Property 8: Default session duration is 25 minutes**
*For any* new session created with the Calm setup and reduced mode inactive, the default duration should be exactly 25 minutes.
**Validates: Requirements 3.2**

**Property 9: Concurrent session prevention**
*For any* user, there should be at most one active session at any time, and attempting to start a second session while one is active should fail with a calm conflict error.
**Validates: Requirements 3.3**

**Property 10: Session state is valid**
*For any* session in the database, its status should be exactly one of: 'active', 'completed', or 'abandoned', never null or any other value.
**Validates: Requirements 3.4**

**Property 11: Reduced mode adjusts session duration**
*For any* session started while reduced mode is active, the session duration should be exactly 60% of the setup's default duration (rounded down to nearest minute).
**Validates: Requirements 3.5, 5.2**

**Property 12: Session end records timestamp and calculates duration**
*For any* session that is ended, the end timestamp should be recorded and the calculated duration should equal (end_time - start_time) in minutes, within a tolerance of 1 minute.
**Validates: Requirements 4.1**

**Property 13: Next step is stored with session**
*For any* next step provided during braking, it should be stored with the session record and be retrievable exactly as entered.
**Validates: Requirements 4.3**

**Property 14: Stopped sessions are marked completed**
*For any* session that is stopped via braking (not abandoned), its status should be 'completed'.
**Validates: Requirements 4.5**


### Reduced Mode Properties

**Property 15: Reduced mode toggle works correctly**
*For any* user, toggling reduced mode on should activate it (is_active = true), toggling off should deactivate it (is_active = false), and the state should be queryable and correct at all times.
**Validates: Requirements 5.4**

**Property 16: Low capacity triggers reduced mode recommendation**
*For any* week data with low capacity signals (completion rate < 50% or daily checks < 3), the system should recommend activating reduced mode.
**Validates: Requirements 5.5, 6.3**

### Weekly Check Properties

**Property 17: At most one insight per weekly check**
*For any* weekly check, there should be 0 or 1 insights generated, never more than 1, regardless of how many notable patterns exist.
**Validates: Requirements 6.4**

**Property 18: Weekly check is persisted with timestamp**
*For any* completed weekly check, it should be stored with a timestamp and be retrievable with all responses intact.
**Validates: Requirements 6.5**

### Setup Properties

**Property 19: Setup selection applies to future sessions**
*For any* setup selection by a user at time T, all sessions created after time T should use that setup's defaults until another setup is selected.
**Validates: Requirements 7.2**

**Property 20: Setup changes don't modify historical data**
*For any* setup change at time T, all existing session records created before time T should remain unchanged (immutability of history).
**Validates: Requirements 7.3**

**Property 21: Setup switching is unrestricted**
*For any* user, switching from setup A to setup B should succeed immediately without restrictions, delays, or penalties.
**Validates: Requirements 7.5**

### Data Persistence and Sync Properties

**Property 22: Data persistence is immediate**
*For any* action that modifies data (creating sessions, daily checks, weekly checks), the data should be persisted to the database and be immediately queryable within 100ms.
**Validates: Requirements 9.1**

**Property 23: Offline changes are queued**
*For any* data modification made while offline, the change should be queued locally and not lost when the app is closed or refreshed.
**Validates: Requirements 9.2**

**Property 24: Online sync processes queued changes**
*For any* queued changes when connectivity is restored, they should be synced to the server automatically within 5 seconds.
**Validates: Requirements 9.3**

**Property 25: Sync conflicts use last-write-wins**
*For any* sync conflict between local and server data, the resolution should follow last-write-wins strategy (most recent timestamp wins).
**Validates: Requirements 9.4**

### Error Handling Properties

**Property 26: Interrupted sessions allow recovery**
*For any* interrupted session (network failure, app crash), the user should be able to either resume it or abandon it cleanly without data loss.
**Validates: Requirements 10.2**

**Property 27: Auth failure preserves data**
*For any* authentication failure or token expiration, all user data should remain intact and accessible after successful re-authentication.
**Validates: Requirements 10.3**

### Accessibility Properties

**Property 28: Text contrast meets WCAG AA**
*For any* text element in the interface, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 11.1**

**Property 29: All interactive elements are keyboard accessible**
*For any* interactive element (buttons, inputs, links), it should be reachable and operable via keyboard navigation alone.
**Validates: Requirements 11.2**

**Property 30: Focus indicators are visible**
*For any* focusable element, when it receives keyboard focus, a visible focus indicator should appear with sufficient contrast.
**Validates: Requirements 11.3**

**Property 31: Screen reader labels are present**
*For any* interactive element, appropriate ARIA labels or text alternatives should be present for screen reader users.
**Validates: Requirements 11.4**

**Property 32: Text scaling preserves layout**
*For any* text size increase up to 200%, the layout should remain functional and readable without horizontal scrolling or content overlap.
**Validates: Requirements 11.5**

### Cross-Platform Properties

**Property 33: Cross-platform sync consistency**
*For any* action completed on platform A (web or mobile), after sync, the same data should be visible and correct on platform B within 10 seconds.
**Validates: Requirements 13.1**

### Visual Design Properties

**Property 34: One primary action per screen**
*For any* screen in the application, there should be exactly one primary action button (visually emphasized with accent color).
**Validates: Requirements 14.3**

### Determinism Properties

**Property 35: Deterministic outputs for same inputs**
*For any* core function (session duration calculation, reduced mode recommendation, insight generation), providing the same inputs should produce the same outputs consistently across all executions.
**Validates: Requirements 15.2**


## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials (wrong email/password)
   - Expired tokens (session timeout)
   - Missing tokens (not authenticated)
   - **Response**: Calm message, prompt for re-authentication, preserve queued changes

2. **Validation Errors**
   - Invalid input format (malformed email, short password)
   - Missing required fields (empty responses)
   - Constraint violations (duplicate daily check)
   - **Response**: Clear explanation of constraint, no blame language, suggest correction

3. **Conflict Errors**
   - Concurrent session attempt (user already has active session)
   - Duplicate daily check (already completed today)
   - **Response**: Informative message, suggest resolution (wait, try again)

4. **Network Errors**
   - Connection timeout (slow network)
   - Server unavailable (maintenance, outage)
   - **Response**: Queue changes locally, inform user calmly, retry automatically

5. **Server Errors**
   - Unexpected failures (500 errors)
   - Database errors (connection issues)
   - **Response**: Generic calm message, log details server-side, allow retry

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable error code (e.g., "CONCURRENT_SESSION")
    message: string;        // User-friendly message (calm tone, no jargon)
    details?: object;       // Optional technical details (not shown to user, logged)
  }
}
```

### Error Handling Principles

- **Never blame the user**: Errors are conditions, not failures
- **Use calm, informative language**: Short sentences, plain words, no urgency
- **Provide clear next steps**: What can the user do to resolve?
- **Log technical details server-side**: Debug info stays in logs, not UI
- **Allow graceful recovery**: Users can retry, resume, or abandon without penalty
- **Preserve user data when possible**: Queue changes, don't lose work

### Example Error Messages

**Good (Calm, Respectful)**:
- "Unable to start right now. Try again in a moment."
- "Let's pause here. Check your connection."
- "That didn't work. Try again?"
- "Already completed today."
- "Connection lost. Changes saved locally."

**Avoid (Technical, Blame, Urgency)**:
- "Error 500: Internal Server Error"
- "You did something wrong!"
- "Oops! Something went wrong!"
- "Failed to create session. Please try again immediately."
- "Invalid input. Fix your mistakes."

## Testing Strategy

### Dual Testing Approach

Makana uses both unit testing and property-based testing to ensure correctness:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs. Together, they provide confidence that the system behaves correctly under all conditions.

### Property-Based Testing

**Library Selection:**
- **Python (Backend)**: Hypothesis (mature, well-documented, integrates with pytest)
- **TypeScript (Frontend)**: fast-check (mature, well-documented, integrates with Vitest/Jest)

**Configuration:**
- Minimum 100 iterations per property test (catches rare edge cases)
- Each test must reference its design document property number
- Tag format: `Feature: makana-v0-foundation, Property {number}: {property_text}`
- Tests should generate realistic data (valid emails, reasonable durations, etc.)

**Example Property Test (Python/Hypothesis):**

```python
from hypothesis import given, strategies as st
import pytest

@given(
    email=st.emails(),
    password=st.text(min_size=8, max_size=128)
)
def test_property_1_user_account_creation(email, password):
    """
    Feature: makana-v0-foundation, Property 1: User account creation succeeds for valid credentials
    Validates: Requirements 1.1
    """
    # Create account
    user = create_user_account(email, password)
    
    # Verify account exists and is retrievable
    retrieved_user = get_user_by_email(email)
    assert retrieved_user is not None
    assert retrieved_user.email == email
    assert retrieved_user.id == user.id
```

**Example Property Test (TypeScript/fast-check):**

```typescript
import fc from 'fast-check';

describe('Property 6: One daily check per calendar day', () => {
  it('should prevent duplicate daily checks for the same date', () => {
    /**
     * Feature: makana-v0-foundation, Property 6: One daily check per calendar day
     * Validates: Requirements 2.4, 2.5
     */
    fc.assert(
      fc.property(
        fc.string(), // user_id
        fc.date(),   // check_date
        fc.object(), // responses
        async (userId, checkDate, responses) => {
          // Create first daily check
          const first = await createDailyCheck(userId, checkDate, responses);
          expect(first).toBeDefined();
          
          // Attempt to create second daily check for same date
          await expect(
            createDailyCheck(userId, checkDate, responses)
          ).rejects.toThrow(/already completed/i);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

**Focus Areas:**
- Specific examples demonstrating correct behavior
- Edge cases (empty inputs, boundary values, null handling)
- Error conditions and recovery paths
- Integration points between components

**Balance:**
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples and integration scenarios
- Use property tests for comprehensive input coverage
- Unit tests should be readable and serve as documentation

**Example Unit Test (Python):**

```python
def test_reduced_mode_adjusts_session_duration():
    """Test that reduced mode reduces session duration by 40%"""
    setup = Setup(default_session_duration=25)
    
    # Normal mode
    normal_duration = calculate_session_duration(setup, reduced_mode=False)
    assert normal_duration == 25
    
    # Reduced mode
    reduced_duration = calculate_session_duration(setup, reduced_mode=True)
    assert reduced_duration == 15  # 25 * 0.6 = 15
```

**Example Unit Test (TypeScript):**

```typescript
describe('Session duration calculation', () => {
  it('should return 25 minutes for Calm setup in normal mode', () => {
    const setup = { default_session_duration: 25 };
    const duration = calculateSessionDuration(setup, false);
    expect(duration).toBe(25);
  });
  
  it('should return 15 minutes for Calm setup in reduced mode', () => {
    const setup = { default_session_duration: 25 };
    const duration = calculateSessionDuration(setup, true);
    expect(duration).toBe(15); // 25 * 0.6 = 15
  });
});
```


### Integration Testing

**Scope:**
- End-to-end user flows (signup → daily check → ignition → braking → weekly check)
- Cross-platform sync scenarios (web → mobile, mobile → web)
- Offline/online transitions (queue → sync → verify)
- Authentication and authorization flows (login → access → expire → re-auth)

**Tools:**
- **Backend**: pytest with test database, API client
- **Frontend**: Playwright or Cypress for E2E, React Testing Library for component integration

**Example Integration Test:**

```python
def test_complete_user_journey():
    """Test full user flow from signup to weekly check"""
    # Sign up
    user = signup(email="test@example.com", password="password123")
    token = signin(email="test@example.com", password="password123")
    
    # Daily check
    daily_check = create_daily_check(
        user_id=user.id,
        responses={"energy": "medium", "intention": "Focus on design"}
    )
    assert daily_check is not None
    
    # Start session (Ignition)
    session = start_session(user_id=user.id, setup_id="calm")
    assert session.status == "active"
    
    # End session (Braking)
    ended_session = end_session(
        session_id=session.id,
        next_step="Review design document"
    )
    assert ended_session.status == "completed"
    assert ended_session.next_step == "Review design document"
    
    # Weekly check (after 7 days of activity)
    weekly_check = create_weekly_check(
        user_id=user.id,
        responses={"capacity": "good", "reflection": "Steady week"}
    )
    assert weekly_check is not None
```

### Accessibility Testing

**Tools:**
- axe-core for automated accessibility checks
- Manual keyboard navigation testing
- Screen reader testing (NVDA on Windows, JAWS on Windows, VoiceOver on macOS/iOS)

**Coverage:**
- All interactive elements (buttons, inputs, links)
- Focus management (tab order, focus indicators)
- ARIA labels (buttons, inputs, landmarks)
- Color contrast (text, interactive elements)
- Text scaling (up to 200%)

**Example Accessibility Test:**

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Ignition screen accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<IgnitionScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard navigable', () => {
    render(<IgnitionScreen />);
    const startButton = screen.getByRole('button', { name: /start session/i });
    
    // Tab to button
    userEvent.tab();
    expect(startButton).toHaveFocus();
    
    // Activate with Enter
    userEvent.keyboard('{Enter}');
    expect(mockStartSession).toHaveBeenCalled();
  });
});
```

### Test Organization

```
backend/
  tests/
    unit/
      test_auth_service.py
      test_session_service.py
      test_rules_engine.py
      test_daily_check_service.py
      test_weekly_check_service.py
      test_reduced_mode_service.py
      test_setup_service.py
    property/
      test_properties_auth.py
      test_properties_sessions.py
      test_properties_reduced_mode.py
      test_properties_daily_check.py
      test_properties_weekly_check.py
      test_properties_setups.py
    integration/
      test_daily_check_flow.py
      test_session_lifecycle.py
      test_weekly_check_flow.py
      test_cross_platform_sync.py

frontend/
  web/
    tests/
      unit/
        components/
          test_button.test.ts
          test_ignition_screen.test.ts
        hooks/
          test_use_session.test.ts
      property/
        test_properties_ui.test.ts
        test_properties_sync.test.ts
      integration/
        test_session_flow.test.ts
        test_daily_check_flow.test.ts
      accessibility/
        test_a11y_ignition.test.ts
        test_a11y_daily_check.test.ts
  mobile/
    tests/
      (similar structure to web)
```

### Continuous Integration

- Run all tests on every commit (unit, property, integration)
- Property tests run with 100 iterations in CI
- Accessibility tests run on UI changes
- Integration tests run on main branch merges
- Test coverage reports generated and tracked

### Test Quality Gates

Before merging to main:
- All unit tests pass (100%)
- All property tests pass with 100 iterations (100%)
- No accessibility violations (axe-core)
- Code coverage > 80% for core logic
- No regressions in existing tests
- Integration tests pass for critical flows

## Deployment and Operations

### Deployment Architecture

**Web Client (Vercel)**:
- Automatic deployments from main branch
- Preview deployments for pull requests
- Edge-optimized static assets
- Environment variables for API endpoints

**Mobile Client (App Store / Play Store)**:
- Manual releases via Expo EAS Build
- Over-the-air updates for non-native changes
- Staged rollouts (10% → 50% → 100%)
- Version tracking and rollback capability

**Backend (Railway / Fly.io)**:
- Containerized deployment (Docker)
- Automatic deployments from main branch
- Environment variables for secrets (database URL, JWT secret)
- Health check endpoint for monitoring

**Database (Supabase)**:
- Managed Postgres with automatic backups
- Row-Level Security enforced
- Connection pooling for performance
- Migration scripts versioned in repo

### Monitoring and Observability

**Structured Logging**:
- JSON format for all logs
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Request/response logging (excluding sensitive data)
- Error categorization and tracking

**Metrics**:
- API response times (p50, p95, p99)
- Database query performance
- Session completion rate
- Daily Check completion rate
- Error rates by category

**Alerting**:
- High error rate (> 5% of requests)
- Slow response times (p95 > 500ms)
- Database connection issues
- Authentication failures spike

### Scaling Considerations

**Rate Limiting**:
- Per-user rate limits on API endpoints (100 requests/minute)
- Tiered limits based on subscription (if applicable)
- Graceful degradation with clear messaging

**Caching**:
- Setup data cached (rarely changes)
- User profile cached (TTL: 5 minutes)
- Active session cached (TTL: 1 minute)
- Redis or in-memory cache

**Background Jobs**:
- Weekly insight generation (async, low priority)
- Weekly check reminders (optional, user preference)
- Data aggregation for analytics (daily batch)
- Simple worker queue (Celery or similar)

**Database Optimization**:
- Appropriate indexes on frequently queried columns
- Partitioning for large tables (if needed in future)
- Regular vacuum and analyze (automatic with Supabase)
- Connection pooling (PgBouncer)

**Graceful Degradation**:
- Offline mode for clients (queue changes)
- Reduced functionality under load (disable non-critical features)
- Clear user communication (calm messages)
- No data loss during degradation

## Future Enhancements (v1 and Beyond)

### v1 Features (Differentiation)

1. **Clutch State Machine**: Full alignment layer with Idle, Engaging, Holding, Limiting, Releasing, Recovering states
2. **Vitality Layer**: Healthspan integration with weekly vitality check-in, one insight max, one suggestion max
3. **Practice Forms**: Gamification through pattern recognition (Clean Start, Clean Stop, Gentle Recovery, Return to Alignment, Continuity Through Low Weeks)
4. **AI Augmentation**: Optional language enhancement (rewrite suggestions, summarize reflections) with provider abstraction and privacy-first design
5. **Monetization**: Open-core model with paid features (multiple custom setups, export/backup, gentle history views)

### v2 Features (Expansion)

1. **User-Created Setups**: Full builder for custom configurations
2. **Setup Sharing**: Private links, opt-in sharing
3. **Offline-First Improvements**: Better conflict resolution, local-first architecture
4. **Advanced Clutch Tuning**: Power user controls for alignment sensitivity
5. **Reflection Tools**: Pattern view (not dashboards), long-term continuity visualization
6. **Internationalization**: Localization for multiple languages

Each addition must protect energy, respect silence, and avoid pressure mechanics.

## Conclusion

Makana v0 Foundation establishes a calm, reliable practice medium that adapts to human energy instead of demanding consistency. The architecture prioritizes deterministic behavior, cross-platform consistency, privacy-first data handling, and restrained design. All core functionality operates without AI, using explicit rules and state machines.

The system treats living as a practice, not a performance. Progress is recognized through forms (clean starts, clean stops, continuity), not metrics. The tool respects user capacity and provides structure without pressure.

This design document serves as the blueprint for implementation, with clear components, interfaces, data models, and correctness properties. Property-based testing ensures universal correctness, while unit tests validate specific examples. Together, they provide confidence that Makana behaves correctly under all conditions.

Makana is built for longevity, not urgency. Stability is a feature. The tool fades into the background, supporting practice over time.
