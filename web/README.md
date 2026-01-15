# Makana Web Client

Next.js 14+ web application for Makana - a practice medium for developing intentional strength.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Supabase Auth
- **Testing**: Vitest + fast-check (property-based testing)

## Design Principles

Makana's web client follows these principles:

- **Calm over stimulation** - Restrained colors, generous spacing, one primary action per screen
- **Restraint over expression** - Minimal UI, no confetti, no pressure mechanics
- **Clarity over decoration** - Clear typography, readable text, functional design
- **Silence as feature** - Over-communication is noise, silence is respect

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

## Project Structure

```
web/
├── app/               # Next.js App Router pages
│   ├── layout.tsx     # Root layout with providers
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles with design system
├── components/        # React components
│   └── ui/            # Shared UI primitives
│       ├── button.tsx # Primary action button
│       ├── card.tsx   # Container component
│       └── input.tsx  # Text input
├── lib/               # Utilities and configuration
│   ├── api-client.ts  # HTTP client with auth
│   ├── supabase.ts    # Supabase client
│   └── query-provider.tsx # React Query provider
└── vitest.config.ts   # Test configuration
```

## Design System

### Colors

- **Background**: Parchment (#f7f5f2)
- **Surface**: Soft Stone (#ece9e4)
- **Text**: Charcoal (#1f1f1f)
- **Accent**: Deep Olive (#4f6a5a) - used sparingly for primary actions

### Typography

- **Base size**: 16px
- **Line height**: 1.5 (body), 1.2 (headings)
- **Font**: Geist Sans (humanist sans-serif)

### Spacing

- Generous spacing throughout (minimum 16px between sections)
- 4px base unit for consistent rhythm

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development workflow and guidelines.

## License

See [LICENSE](../LICENSE) for details.
