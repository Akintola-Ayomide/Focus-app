# Focus Flow

A  productivity web app that helps you manage focus sessions, track daily habits, and visualize your productivity trends. Built with Next.js, TypeScript, and TailwindCSS for a seamless, responsive experience.

## Live Demo

https://focus-flow.vercel.app



## Problem & Solution

Staying focused in today's distracted world is challenging. Focus Flow solves this by providing:

- **Pomodoro Timer**: Structured focus sessions with customizable durations (15, 25, or 45 minutes)
- **Habit Tracking**: Build and maintain daily habits with visual streak tracking
- **Productivity Insights**: Visualize your focus patterns and habit completion rates over time
- **Persistent Storage**: All data is saved locally—no backend required, complete privacy

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Charts**: [Recharts](https://recharts.org)
- **Testing**: [Jest](https://jestjs.io) + [React Testing Library](https://testing-library.com/react)
- **State Management**: Custom hooks with localStorage persistence
- **Deployment**: [Vercel](https://vercel.com)

## Key Features

### Focus Timer
- Pomodoro-style timer with preset durations (15, 25, 45 minutes)
- Automatic break transitions between sessions
- Session history tracking with completion statistics
- Audio notifications for session completion
- Keyboard shortcuts for quick control

### Habit Tracker
- Create and manage daily habits with custom names and icons
- Track daily completion with visual checkmarks
- Streak counter to maintain motivation
- Edit and delete habits as needed
- Persistent storage across browser sessions

### Insights Dashboard
- 7-day focus session trend visualization
- Habit completion rate charts
- Real-time statistics and metrics
- Responsive charts that work on all screen sizes
- Dark mode optimized visualizations

### Dark Mode
- Automatic theme detection based on system preferences
- Manual toggle for light/dark mode
- Persistent theme preference
- Smooth transitions between themes
- WCAG compliant color contrast

## Project Structure

\`\`\`
focus-flow/
├── app/
│   ├── layout.tsx           # Root layout with metadata and theme setup
│   ├── page.tsx             # Main app shell with navigation
│   └── globals.css          # Global styles and design tokens
├── components/
│   ├── pages/               # Page-level components
│   │   ├── home-page.tsx
│   │   ├── focus-timer-page.tsx
│   │   ├── habit-tracker-page.tsx
│   │   └── insights-page.tsx
│   ├── focus-timer.tsx      # Pomodoro timer component
│   ├── focus-chart.tsx      # Focus trends visualization
│   ├── habit-form.tsx       # Habit creation form
│   ├── habit-list.tsx       # Habit display and management
│   ├── habit-chart.tsx      # Habit completion visualization
│   ├── session-history.tsx  # Focus session history
│   ├── navigation.tsx       # Main navigation component
│   ├── theme-toggle.tsx     # Dark mode toggle
│   └── ui/                  # Reusable shadcn/ui components
├── hooks/
│   ├── use-focus-store.ts   # Focus session state management
│   ├── use-habit-store.ts   # Habit state management
│   ├── use-mobile.ts        # Mobile detection hook
│   └── use-toast.ts         # Toast notifications hook
├── lib/
│   └── utils.ts             # Utility functions (cn, etc.)
├── __tests__/
│   ├── hooks/               # Hook unit tests
│   └── components/          # Component tests
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup file
├── next.config.mjs          # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
\`\`\`

## Installation & Setup

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Clone & Install

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/focus-flow.git
cd focus-flow

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
\`\`\`

### Run Locally

\`\`\`bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
\`\`\`

### Build for Production

\`\`\`bash
# Create an optimized production build
npm run build

# Start the production server
npm start
\`\`\`

## Testing

The project includes comprehensive unit tests for hooks and components using Jest and React Testing Library.

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
\`\`\`

### Test Files

- `__tests__/hooks/use-focus-store.test.ts` - Focus timer state management tests
- `__tests__/hooks/use-habit-store.test.ts` - Habit tracker state management tests
- `__tests__/components/focus-timer.test.tsx` - Focus timer component tests

## Performance & Optimization

### Performance Features

- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Lazy Loading**: Components load on-demand to reduce initial bundle size
- **Memoization**: React.memo and useMemo for expensive calculations
- **Optimized Re-renders**: useCallback for stable function references
- **Image Optimization**: Next.js Image component for responsive images
- **CSS-in-JS**: TailwindCSS for minimal CSS output

### Accessibility (WCAG 2.1 AA)

- **Semantic HTML**: Proper use of heading hierarchy and semantic elements
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Visible focus indicators and proper focus order
- **Color Contrast**: WCAG AA compliant color combinations
- **Reduced Motion**: Respects `prefers-reduced-motion` system preference
- **Form Accessibility**: Proper labels and error messages for all inputs

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy Focus Flow is with [Vercel](https://vercel.com):

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

Or use the button at the top of this README.

### Deploy to Other Platforms

Focus Flow can be deployed to any platform that supports Next.js:

- **Netlify**: `npm run build` then deploy the `.next` folder
- **GitHub Pages**: Use `next export` (static export)
- **Docker**: Create a Dockerfile for containerized deployment

## Environment Variables

Focus Flow is fully frontend-based and doesn't require environment variables. However, you can optionally add:

\`\`\`env
# Optional: For analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
\`\`\`


## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Charts powered by [Recharts](https://recharts.org)
- Deployed on [Vercel](https://vercel.com)


**Start your focused work today with Focus Flow!.**