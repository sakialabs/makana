# Changelog

All notable changes to Makana will be documented here.

## [Unreleased]

### Mobile Home Screen Auth Alignment (2026-01-14)

**Tone-Aligned Language**
- Updated primary CTA from "Get Started" to "Begin Practice"
- Matches web version language exactly
- Calm, intentional tone throughout

**Direct Sign-In Access**
- Added sign-in link directly on home screen
- One-tap navigation to sign-in for returning users
- Clear visual hierarchy: primary action (Begin Practice) vs secondary (sign-in link)
- Language: "Already practicing? Sign in"

**Navigation Improvements**
- App.tsx updated to support sign-in from home screen
- Reduced navigation friction for returning users
- Cross-platform consistency with web auth flow

**Testing**
- Property-based test written for button text consistency
- Test environment configuration pending (Expo 54 compatibility)

### Mobile Visual Alignment (2026-01-14)

**Design System & Components**
- Aligned mobile design system with web (colors, spacing, typography)
- Updated 5 core components: Button, Card, Input, Container, Logo (new)
- Enhanced shadows, white cards, calm styling
- Fixed color references (accent instead of deepOlive, warmGray instead of softSand)
- Removed react-native-reanimated dependency for Expo Go compatibility

**Screens Updated**
- HomeScreen: Logo, centered layout, 64px spacing
- SignInScreen: Animated logo, centered layout, improved styling
- SignUpScreen: Animated logo, centered layout, improved styling

**Visual Improvements**
- Container padding: 16px → 24px
- Screen padding: 32px → 48px
- Hero title: 30px → 36px
- Subtle shadows for depth (0.05-0.08 opacity)
- Professional, calm aesthetic matching web
- Animated GIF logo on splash screen

**Technical Changes**
- Removed react-native-reanimated to fix Expo Go compatibility
- Simplified animations using native React Native components
- Fixed worklets version mismatch errors
- App now loads successfully in Expo Go on iOS

**Remaining Work**
- 15 screens to update following established pattern
- Pattern documented in consolidated mobile alignment guide

### Authentication Flow Improvements (2026-01-14)

**Email Confirmation Support**
- Added email confirmation detection and handling for sign-up flow
- Created confirmation screens for web and mobile with resend functionality
- Automatic redirect to dashboard when confirmation not required
- Post-confirmation callback handling with automatic sign-in

**Enhanced Error Messaging**
- Context-aware error messages (sign-up vs sign-in)
- Calm, user-friendly error mapping for all Supabase auth errors
- Unconfirmed email detection with resend option during sign-in
- Rate limiting handling for confirmation email resends
- Consistent error messages across web and mobile platforms

**Development Mode Support**
- Enhanced console warnings with setup instructions
- Bypass email confirmation in development environments
- Clear guidance for Supabase configuration

**Cross-Platform Consistency**
- Matching auth flows between web and mobile
- Same error messages and user feedback
- Consistent confirmation and resend behavior
- All 13 implementation tasks completed with property-based tests

### API Integration & Testing Complete (2026-01-14)

**Backend API Integration**
- All API endpoints tested and operational
- 43/43 automated tests passing (100% pass rate)
- 68% code coverage achieved
- Daily Check, Sessions, Reduced Mode, Weekly Check, Setups all integrated
- Cross-platform consistency (web + mobile)

**Social Authentication**
- Added Google, Apple, Facebook, GitHub OAuth buttons
- Icon-only circular design matching Makana aesthetic
- Positioned below email/password form with "Or continue with" divider
- Requires Supabase OAuth provider configuration (see deployment docs)
- Calm error handling for unconfigured providers

**Web Deployment Preparation**
- Created `netlify.toml` for Netlify deployment configuration
- Fixed `.gitignore` to not exclude `web/lib/` folder
- Build verified and passing
- Created deployment guide at `web/NETLIFY_DEPLOYMENT.md`
- Environment variables documented

**Error Banner Animation**
- Fixed banner positioning (now appears at top of form)
- Added shake animation for error visibility
- Smooth fade-in transitions
- Calm, non-aggressive styling

### Foundation Work (2026-01-13)

**Error Handling Refinement (Task 24) - COMPLETE**
- Created `web/lib/error-handling.ts` with comprehensive error utilities
  - Error categorization: auth, validation, conflict, network, server, not_found, permission, unknown
  - Error severity levels: info, warning, error, critical
  - Calm error messages for all scenarios (no blame language)
  - User-friendly message mapping for 30+ error codes
  - Error recovery detection and suggested actions
  - Structured MakanaError interface with context
  - Cross-platform error codes constants
- Created `mobile/lib/error-handling.ts` matching web implementation
  - Same error categories and severity levels
  - Same calm messaging for consistency
  - React Native Alert integration
  - Platform-specific error handling
- Created `web/lib/error-logger.ts` for centralized logging
  - In-memory log storage (last 100 entries)
  - Console logging with proper levels (info, warn, error, debug)
  - Prepared for error tracking service integration (Sentry)
  - Log export functionality for debugging
  - Performance logging for slow operations
  - User action logging (development only)
  - Component error logging
  - API error logging with context
- Created `web/components/ui/error-message.tsx` with calm error displays
  - ErrorMessage component for inline errors
  - InlineError component for form field errors
  - ErrorBanner component for page-level errors
  - ErrorPage component for full-page errors
  - Retry functionality for recoverable errors
  - Dismiss functionality with smooth animations
  - ARIA live regions for screen reader announcements
  - Calm visual styling (muted red, not aggressive)
- All error messages follow principles:
  - No blame language ("Unable to start" not "You failed")
  - Clear next steps ("Try again in a moment")
  - Short sentences and plain language
  - Calm, supportive tone throughout
- Error scenarios covered:
  - Authentication errors (invalid credentials, session expired, etc.)
  - Validation errors (required fields, invalid format, etc.)
  - Conflict errors (concurrent session, duplicate check, etc.)
  - Network errors (offline, timeout, connection failed, etc.)
- Fixed TypeScript errors in error handling files (escaped apostrophes in error messages)
- All TypeScript diagnostics pass

**Setup Management UI (Task 19) - COMPLETE**
- Created `web/app/setups/page.tsx` with setup selector interface
  - Displays all three preset setups (Calm, Reduced, Vitality)
  - Shows setup descriptions, durations, and emphasis
  - Visual indicator for active setup (2px Deep Olive border, badge)
  - One-click setup activation with loading state
  - Calm confirmation and automatic navigation back to dashboard
  - Error handling with calm messages
- Created `web/components/ui/active-setup-badge.tsx` for persistent setup display
  - Shows active setup name with visual indicator (Deep Olive dot)
  - Displayed in dashboard header for constant visibility
  - Loads setup data on mount
  - Silently fails if unable to load (not critical)
- Created `mobile/screens/SetupScreen.tsx` matching web functionality
  - Same setup display and activation flow
  - Touch-optimized interface with proper spacing
  - Loading and error states
  - Calm visual styling matching design system
  - Platform-appropriate navigation
- Created `mobile/components/ActiveSetupBadge.tsx` for persistent setup display
  - Matches web implementation
  - Platform-appropriate styling (React Native)
  - Same visual indicator pattern
- Updated `web/app/dashboard/page.tsx` to show active setup badge and link to setups page
  - Active setup badge in header next to "Practice" title
  - Fixed setups card link to point to `/setups` (not `/dashboard/setups`)
- Setup switching features:
  - No restrictions or penalties for switching setups
  - Unrestricted setup switching at any time
  - Setup changes apply to future sessions only (historical data immutable)
  - Calm confirmation after activation
- Cross-platform consistency maintained
- All TypeScript diagnostics pass

**Performance Optimization (Task 26) - COMPLETE**
- Created `web/lib/api-cache.ts` with intelligent caching strategy
  - Setups cached indefinitely (rarely change)
  - User profile cached 5 minutes
  - Active session cached 1 minute
  - Active setup cached 5 minutes
  - Reduced mode state cached 1 minute
  - Automatic cache invalidation on mutations
  - Pattern-based cache invalidation
  - Cache statistics for debugging
- Created `mobile/lib/api-cache.ts` matching web implementation
  - Same caching strategy for cross-platform consistency
  - In-memory cache with TTL management
  - Automatic expiration and cleanup
- Enhanced `web/lib/api-client.ts` with performance optimizations
  - Request deduplication (prevents duplicate concurrent requests)
  - Automatic caching for GET requests
  - Cache-aware request handling
  - Automatic cache invalidation on POST/PATCH/DELETE
  - Optional cache bypass for fresh data
  - Custom cache TTL support
- Enhanced `mobile/lib/api-client.ts` with same optimizations
  - Matches web client performance features
  - Request deduplication
  - Intelligent caching
- Created `web/lib/performance-monitor.ts` for performance tracking
  - Records API request durations
  - Calculates p50, p95, p99 percentiles
  - Warns on slow requests (> 200ms)
  - Per-endpoint statistics
  - Success rate tracking
  - Metric export for analysis
- Performance targets:
  - API response times < 200ms for p95
  - Reduced network requests through caching
  - Improved perceived performance through request deduplication
  - Automatic performance monitoring and alerting
- All TypeScript diagnostics pass
  - Server errors (internal error, maintenance, rate limit, etc.)
  - Not found errors (resource, page, session, etc.)
  - Permission errors (denied, read-only, etc.)

**Visual Design Polish (Task 23)**
- Created `web/lib/design-tokens.ts` with comprehensive design system tokens
  - Color palette: Parchment, Soft Stone, Light Stone, Charcoal, Slate, Muted, Deep Olive
  - Spacing scale: 4px base unit (xs to 4xl)
  - Typography scale: 12px to 48px with proper line heights
  - Border radius, shadows, transitions, breakpoints, z-index
  - Dark mode color tokens (for future implementation)
  - Contrast validation pairs ensuring WCAG AA compliance
  - Design principles documentation
- Enhanced `web/app/globals.css` with comprehensive design system
  - CSS custom properties for all design tokens
  - Improved typography hierarchy (h1-h6 with proper sizing)
  - Enhanced link styles with hover and focus states
  - Selection styling with Deep Olive accent
  - Calm scrollbar styling (minimal, non-intrusive)
  - Smooth scroll behavior (respecting reduced motion)
  - Calm animations (fadeIn, slideUp) with subtle timing
  - Print styles for clean printing
  - Utility classes for text balance and pretty wrapping
- Verified no pressure mechanics exist in UI
  - No streak counters anywhere
  - No leaderboards or social comparison features
  - No performance dashboards or productivity metrics
  - All feedback is calm and non-judgmental
  - No confetti or aggressive animations
- Applied generous spacing throughout (minimum 16px between sections)
- Ensured readable typography with proper line heights (1.5 for body, 1.2 for headings)
- Verified one primary action per screen (Deep Olive accent)
- All colors meet WCAG AA contrast requirements

**Accessibility Implementation (Task 22)**
- Created `web/lib/accessibility.ts` with contrast checking, label generation, screen reader announcements, and focus management utilities
- Created `mobile/lib/accessibility.ts` with React Native accessibility utilities, screen reader support, and platform-specific helpers
- Updated `web/app/globals.css` with `.sr-only` class, skip-to-main link styling, high contrast mode support, text scaling support (up to 200%), and reduced motion support
- Added skip-to-main-content link in `web/app/layout.tsx` for keyboard navigation
- Updated `web/app/page.tsx` with semantic HTML (main, section, h1-h3), ARIA labels, and landmarks
- Enhanced `web/components/ui/button.tsx` with `ariaLabel` prop and `aria-disabled` attribute
- Enhanced `web/components/ui/input.tsx` with proper label associations, error announcements, `aria-invalid`, and `aria-describedby`
- Enhanced `web/components/ui/card.tsx` with semantic element support (`as` prop), `ariaLabel` prop for flexible accessibility
- Updated `web/app/dashboard/page.tsx` with semantic HTML (main, header, nav), keyboard navigation (Enter key support), focus indicators, and ARIA labels
- Updated `web/app/about/page.tsx` with proper heading hierarchy, section landmarks, and ARIA labelledby attributes
- Updated `web/app/clutch/page.tsx` with semantic structure, ARIA labels for interactive logo, and section landmarks
- Updated `web/app/contact/page.tsx` with semantic HTML, ARIA labels for email link, and focus indicators
- All interactive elements now keyboard accessible with visible focus indicators (2px outline, Deep Olive color)
- Screen reader support with ARIA labels, landmarks, and semantic HTML throughout
- Text scaling support up to 200% without layout breakage (using relative units)
- High contrast mode support for improved visibility
- Reduced motion support respecting user preferences

**Backend Infrastructure**
- Established FastAPI project structure with configuration management and structured logging
- Integrated Supabase Auth with JWT verification and user profile management
- Created complete database schema with Row-Level Security policies
- Seeded preset setups: Calm (25min), Reduced (15min), Vitality (30min)

**Core Data Models**
- User, Session, Daily Check, Weekly Check, Setup, Reduced Mode models
- Request/response schemas with validation
- Type hints and comprehensive docstrings throughout

**Daily Check System**
- Service layer with duplicate prevention (one check per day)
- API endpoints: create, get today's check, history with pagination
- Calm error messaging for conflicts

**Session System (Ignition/Braking)**
- Service layer with concurrent session prevention
- Rules engine for deterministic duration calculation
- API endpoints: start (Ignition), end (Braking), abandon, get active, recent history
- Duration calculation based on setup and reduced mode (60% reduction)
- Next step capture during Braking (optional, no pressure)

**Reduced Mode System**
- Service layer with idempotent state transitions
- API endpoints: activate, deactivate, get status
- Automatic duration adjustment (60% of default)
- Calm state change responses

**Weekly Check System**
- Service layer with insight generation (at most one)
- Week data aggregation for pattern recognition
- Scope recommendations based on capacity signals
- API endpoints: create, get latest, history with pagination
- Recognizes practice forms: clean stops, continuity

**Setup Management**
- Service layer for preset configuration
- API endpoints: list setups, activate, get active
- Unrestricted switching between presets
- Historical sessions remain immutable (setup snapshot at start)
- Defaults to Calm setup if none activated

**Rules Engine**
- Pure functions for deterministic logic
- Session duration calculation (setup + reduced mode)
- Reduced mode recommendation (<50% completion or <3 daily checks)
- Insight generation (clean stops, continuity)
- All logic is testable and predictable

**Testing & Quality Assurance**
- Unit tests for auth, daily check, rules engine
- Integration tests for API health and endpoints
- Test runner scripts (bash + PowerShell)
- All tests verify calm error messaging
- Type hints and docstrings throughout

**Development Environment**
- Configured Docker Compose for local development with PostgreSQL
- Set up Conda environment for Python 3.11
- Added pytest with Hypothesis for property-based testing
- Configured code quality tools (ruff, black, mypy)

**Contributor Onboarding**
- Created setup, dev, test, and API test scripts (bash + PowerShell)
- Added CONTRIBUTING.md with development workflow and guidelines
- Updated README.md with streamlined Quick Start section
- Added docs/README.md to explain documentation structure
- Cross-linked documentation for easy navigation

**Web Client Foundation**
- Initialized Next.js 14+ project with App Router and TypeScript
- Configured React Query for state management and caching
- Set up Vitest with fast-check for property-based testing
- Integrated Framer Motion for smooth, gentle animations
- Integrated shadcn/ui patterns with class-variance-authority
- Created shared UI primitives (Button, Card, Input, Container) following design system
- Implemented Makana's color palette (Parchment, Deep Olive accent)
- Set up API client with auth headers and calm error handling
- Configured Supabase client for authentication
- Applied generous spacing and readable typography throughout

**Public Pages & Navigation**
- Built responsive Header with mobile menu
- Built Footer with product and legal links
- Created Home page with hero, features, and CTA sections
- Created About page with Vision and Manifesto content
- Created Clutch page (Meet Clutch) explaining alignment layer
- Created Contact page with email information
- Created Privacy Policy and Terms of Service pages
- Created 404 Not Found page
- Created placeholder Sign In and Sign Up pages

**Authenticated Layout Components**
- Built Sidebar for large screens with navigation
- Built Bottom Navigation for mobile and small screens
- Implemented smooth transitions and hover states
- Applied Deep Olive accent for active states

**Mobile Client Foundation**
- Initialized Expo project with TypeScript and managed workflow
- Configured React Query for state management (same config as web)
- Set up Jest with fast-check for property-based testing
- Integrated React Native Reanimated for smooth animations
- Created shared UI primitives (Button, Card, Input, Container) matching web
- Implemented design system: colors, spacing, typography modules
- Set up API client with axios, auth headers, and calm error handling
- Configured Supabase client with expo-secure-store for token persistence
- Created HomeScreen with hero and features sections
- Applied same color palette and spacing as web for consistency
- Created .env.example and comprehensive README

**Authentication UI (Web and Mobile)**
- Created useAuth hook for session state management (web)
- Implemented auth utilities with calm error messaging (web and mobile)
  - Email/password validation (email format, password >= 8 chars)
  - Technical errors converted to user-friendly messages
  - No blame language ("Unable to sign in" not "You failed")
- Built functional Sign In page with validation and error handling (web)
- Built functional Sign Up page with validation and success confirmation (web)
- Created placeholder Dashboard page for authenticated users (web)
- Implemented SignInScreen with keyboard handling (mobile)
- Implemented SignUpScreen with keyboard handling (mobile)
- Integrated Supabase Auth for secure authentication
  - JWT tokens with automatic refresh
  - Session persistence (localStorage for web, expo-secure-store for mobile)
  - Automatic re-authentication on token expiration
- Cross-platform consistency in auth flows
  - Same validation rules across web and mobile
  - Same error messages and user experience
  - Same calm, restrained aesthetic

**Daily Check UI (Web and Mobile)**
- Implemented Daily Check page with calm, non-judgmental prompts (web)
  - Two simple questions: feeling and optional intention
  - One primary action (Complete Check-In button)
  - Generous spacing and readable typography
  - Prevents duplicate submissions for same day
- Created completion confirmation page with calm acknowledgment (web)
- Built Daily Check history view with reverse chronological display (web)
  - Past check-ins with dates and responses
  - Calm empty state when no checks exist
  - No metrics, no judgments, just records
- Implemented DailyCheckScreen with keyboard handling (mobile)
  - Multiline text inputs for thoughtful responses
  - Same calm prompts as web version
- Implemented DailyCheckHistoryScreen (mobile)
  - Matches web history layout and tone
- Updated Dashboard with Daily Check navigation (web)
- Cross-platform consistency in Daily Check flows
  - Same questions and prompts
  - Same calm, invitational tone
  - Same generous spacing

**Session UI - Ignition and Braking (Web and Mobile)**
- Implemented Ignition page with minimal friction (web)
  - One primary action (Begin Session button)
  - Setup and duration display (Calm, 25 minutes)
  - Concurrent session prevention with calm error
- Created Active Session page with countdown timer (web)
  - Large, readable timer display
  - Minimal interface (timer + stop button only)
  - One second countdown updates
- Built Braking page for clean stops (web)
  - Optional next step capture (text input)
  - Clear messaging: "You can skip this if nothing comes to mind"
  - No pressure, no requirement
- Created Session Complete confirmation page (web)
  - Calm acknowledgment: "Clean stop"
  - No confetti, no metrics
- Built Session History view (web)
  - Recent sessions with dates and durations
  - Next steps displayed when captured
  - Calm empty state: "No sessions yet. Begin when ready."
  - No streak counters, no performance metrics
- Implemented SessionScreen (Ignition) with setup display (mobile)
  - Matches web Ignition flow
  - Same calm, minimal interface
- Implemented ActiveSessionScreen with countdown timer (mobile)
  - Large timer display (64px font)
  - Minimal interface during session
- Implemented BrakingScreen with optional next step (mobile)
  - Multiline text input for next step
  - Same calm messaging as web
- Implemented SessionHistoryScreen (mobile)
  - Matches web history layout
- Updated Dashboard with Session navigation (web)
- Cross-platform consistency in Session flows
  - Same prompts and messaging
  - Same minimal interface during active sessions
  - Same calm confirmations

**Reduced Mode UI (Web and Mobile)**
- Implemented Reduced Mode page with toggle control (web)
  - One primary action (Activate/Deactivate button)
  - Status display (Active/Inactive)
  - Calm explanation of reduced mode purpose
  - No restrictions or penalties for toggling
- Created ReducedModeScreen with toggle control (mobile)
  - Matches web functionality and layout
  - Same calm explanation and messaging
- Added visual indicator when reduced mode is active
  - Subtle badge on Session screens: "Reduced mode active"
  - Deep Olive color for active state
  - Not alarming, just informational
- Adjusted UI to show reduced duration when active
  - 15 minutes displayed instead of 25 minutes
  - Duration updates automatically based on state
- Updated Dashboard with Reduced Mode navigation (web)
  - New card: "Reduced Mode - Adjust for capacity"
- Updated Session screens to show reduced mode indicator
  - Web Ignition page shows indicator and adjusted duration
  - Mobile SessionScreen shows indicator and adjusted duration
- Cross-platform consistency in Reduced Mode flows
  - Same toggle behavior
  - Same visual indicators
  - Same calm, supportive messaging

**Weekly Check UI (Web and Mobile)**
- Implemented Weekly Check page with reflection question (web)
  - One question: "How was your capacity this week?"
  - Multiline text input for thoughtful response
  - Optional reflection (no pressure to share)
  - One primary action (Complete Check button)
- Created Weekly Check Insight page (web)
  - Displays at most one insight (or "Continue practicing" if none)
  - Shows scope recommendation if capacity signals are low
  - One-button Reduced Mode activation from recommendation
  - Calm acknowledgment: "Week Complete"
- Built Weekly Check History view (web)
  - Past reflections with week date ranges
  - Insights displayed when present
  - Calm empty state: "No weekly checks yet. Complete one when ready."
  - No metrics, no judgments, just records
- Implemented WeeklyCheckScreen with keyboard handling (mobile)
  - Matches web reflection flow
  - Same calm, invitational tone
- Implemented WeeklyCheckInsightScreen (mobile)
  - Displays insight and scope recommendation
  - One-button Reduced Mode activation
  - Same calm messaging as web
- Implemented WeeklyCheckHistoryScreen (mobile)
  - Matches web history layout and tone
- Updated Dashboard with Weekly Check navigation (web)
  - New card: "Weekly Check - Reflect on the week"
- Cross-platform consistency in Weekly Check flows
  - Same reflection question
  - Same insight display logic (at most one)
  - Same calm, non-judgmental language
  - No pressure, no blame

**Logo Integration and Visual Polish**
- Created Logo component with static/animated variants (web)
  - Static logo.png for headers, footers, sidebars
  - Animated logo.gif for auth pages and special moments
  - ClutchLogo component with clutch.png
  - Supports sm/md/lg sizes with proper scaling
  - Reduced logo sizes for better proportions (sm: 32x32, md: 80x80, lg: 120x120)
- Integrated logos across all web pages
  - Header: static logo in top-left (32x32)
  - Footer: static logo with branding
  - Sidebar: static logo for authenticated users
  - Sign In/Sign Up: animated logo above forms (80x80)
  - Clutch page: ClutchLogo with smooth magnet animation
- Updated favicon to use logo.png (web)
- Updated mobile app.json configuration
  - App name: "Makana" (was "mobile")
  - Icon: logo.png for all platforms
  - Splash screen: logo.png with Parchment background
  - Favicon: logo.png for web builds
- Applied Parchment background (#f7f5f2) to all pages
  - Home, About, Clutch, Contact pages
  - Privacy Policy, Terms of Service pages
  - 404 Not Found page
  - All dashboard and authenticated pages
  - Consistent calm aesthetic throughout
- Fixed Framer Motion server component errors
  - Added 'use client' directive to all pages using motion components
  - Fixed home page, button, card, and input components
  - All TypeScript diagnostics pass
- Improved button styling for professional appearance
  - Refined padding and sizing (sm: px-4 py-2, md: px-6 py-2.5, lg: px-8 py-3)
  - Added subtle shadows and smooth transitions
  - Better hover states with Deep Olive accent
  - Rounded corners (rounded-lg) for modern feel
  - Improved focus states for accessibility
- Enhanced header navigation
  - Increased header height for better breathing room (h-20)
  - Better spacing between nav items
  - Improved hover states with background highlights
  - Cleaner mobile menu with better padding
- Improved page layouts and spacing
  - Increased vertical padding (py-20 to py-24)
  - Better section spacing throughout
  - Larger, more readable typography
  - Generous card padding (lg: p-8)
  - Improved Contact page with larger icons and text
  - Enhanced About page with better hierarchy
  - Refined Clutch page with centered headings
  - Better Sign In page layout with centered title
- Cross-platform visual consistency
  - Same logo usage patterns
  - Same Parchment background color
  - Same Deep Olive accent color
  - Same generous spacing and typography
  - Professional, calm aesthetic throughout

**TASK 19 COMPLETE: Setup Management UI (Web and Mobile)**
- Implemented Setup Selector page with preset setups display (web)
- Created SetupsScreen with setup selection functionality (mobile)
- Displays available setups: Calm (25min), Reduced (15min), Vitality (30min)
- Shows setup details: name, duration, description, emphasis
- Visual indicator for currently active setup (checkmark and border highlight)
- One-button activation for switching setups
- Calm confirmation after setup selection
- No restrictions or penalties for switching
- Updated Dashboard with Setups navigation card (web)
- Cross-platform consistency in setup management flows
- Calm messaging: "Switching setups won't affect your past sessions"
- All TypeScript diagnostics pass

**TASK 20 COMPLETE: Offline Support and Sync (Web and Mobile)**
- Implemented offline queue manager for web (localStorage persistence)
- Implemented offline queue manager for mobile (AsyncStorage persistence)
- Created useOfflineSync hook for monitoring offline/sync state
- Built offline-aware API client wrapper
- Automatic change queuing when network is unavailable
- Automatic sync when connectivity is restored
- Exponential backoff retry strategy (max 3 retries)
- Last-write-wins conflict resolution strategy
- Sync status indicator component with calm messaging
- Queue persists across app restarts
- Network state detection (online/offline events)
- Graceful handling of sync failures
- Added required dependencies: @react-native-async-storage/async-storage, @react-native-community/netinfo
- Cross-platform consistency in offline behavior
- All TypeScript diagnostics pass

**Next Steps**
- Accessibility implementation (Task 22)
- Visual design polish (Task 23)
- Error handling refinement (Task 24)
- Integration testing (Task 25)
- Performance optimization (Task 26)

---

## About Versioning

Makana follows a calm, intentional release approach. Version numbers reflect stability and readiness, not urgency. We value durability over novelty.

- **v0**: Foundation and dogfooding (internal use, 2-4 weeks)
- **v1**: Differentiation (Clutch, Vitality, Practice Forms, AI augmentation)
- **v2**: Expansion (custom setups, sharing, advanced tools)

Each version is released when ready, not when rushed.
