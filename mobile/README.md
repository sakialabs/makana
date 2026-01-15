# Makana Mobile Client

Expo (React Native) mobile application for Makana - a practice medium for developing intentional strength.

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Supabase Auth with expo-secure-store
- **Animations**: React Native Reanimated
- **Navigation**: React Navigation
- **Testing**: Jest + fast-check (property-based testing)

## Design Principles

Makana's mobile client follows the same principles as the web client:

- **Calm over stimulation** - Restrained colors, generous spacing, one primary action per screen
- **Restraint over expression** - Minimal UI, no confetti, no pressure mechanics
- **Clarity over decoration** - Clear typography, readable text, functional design
- **Silence as feature** - Over-communication is noise, silence is respect

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
```

### Development

```bash
# Start Expo development server
npm start

# Run on iOS simulator (macOS only)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (for testing)
npm run web
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Project Structure

```
mobile/
├── components/         # React Native components
│   └── ui/            # Shared UI primitives
│       ├── Button.tsx # Primary action button
│       ├── Card.tsx   # Container component
│       ├── Input.tsx  # Text input
│       └── Container.tsx # Layout container
├── screens/           # App screens
│   └── HomeScreen.tsx # Landing screen
├── lib/               # Utilities and configuration
│   ├── api-client.ts  # HTTP client with auth
│   └── supabase.ts    # Supabase client
├── theme/             # Design system
│   ├── colors.ts      # Color palette
│   ├── spacing.ts     # Spacing scale
│   ├── typography.ts  # Typography scale
│   └── index.ts       # Theme exports
└── App.tsx            # App entry point
```

## Design System

### Colors

- **Background**: Parchment (#F7F5F2)
- **Surface**: Soft Stone (#ECE9E4)
- **Text**: Charcoal (#1F1F1F)
- **Accent**: Deep Olive (#4F6A5A) - used sparingly for primary actions

### Typography

- **Base size**: 16px
- **Line height**: 1.5 (body), 1.2 (headings)
- **Weights**: Normal (400), Medium (500), Semibold (600)

### Spacing

- Generous spacing throughout (minimum 16px between sections)
- 4px base unit for consistent rhythm

### Animations

- Smooth, gentle animations using React Native Reanimated
- Spring-based transitions (250-350ms duration)
- Subtle scale effects on button press (0.98 scale)

## Cross-Platform Consistency

The mobile client mirrors the web client's design system:

- Same color palette
- Same spacing scale
- Same typography scale
- Same component API (Button, Card, Input, Container)
- Same calm, restrained aesthetic

This ensures a consistent experience across web and mobile platforms.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development workflow and guidelines.

## License

See [LICENSE](../LICENSE) for details.
