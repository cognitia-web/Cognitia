# Cognitia - Goal Tracking Application

## Overview
Cognitia is a premium goal-tracking platform built with modern web technologies. It features stunning visuals, particle animations, and an intelligent interface for managing and tracking personal and professional goals.

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Backend Integration**: Supabase
- **Animations**: Framer Motion

### Project Structure
```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── AnimatedCounter.tsx
│   ├── FloatingActionButton.tsx
│   ├── FloatingSidebar.tsx
│   ├── Footer.tsx
│   ├── GoalCard.tsx
│   ├── HeroSlideshow.tsx
│   ├── LoadingAnimation.tsx
│   ├── Logo.tsx
│   ├── ParticleBackground.tsx
│   ├── ScrollProgress.tsx
│   └── ThemeToggleButton.tsx
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations (Supabase)
├── lib/             # Utility functions
├── pages/           # Page components
│   ├── Index.tsx    # Main landing page
│   └── NotFound.tsx # 404 page
├── App.tsx          # Root application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

### Key Features
- Beautiful particle background animations
- Floating sidebar navigation
- Hero slideshow with smooth transitions
- Goal cards with progress tracking
- Theme toggle (light/dark mode)
- Responsive design
- Accessibility features (skip to content, ARIA labels)
- Smooth scroll behavior
- SEO optimized with meta tags

## Development Setup

### Running Locally
The application is configured to run on port 5000 with Vite's development server:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Replit Configuration

### Vite Configuration
- **Host**: 0.0.0.0 (required for Replit)
- **Port**: 5000 (Replit's standard frontend port)
- **HMR**: Configured with WebSocket for hot module replacement
- **Strict Port**: Enabled to ensure consistent port usage

### Workflow
The "Start application" workflow runs `npm run dev` and serves the application on port 5000.

## Recent Changes (October 3, 2025)
- Configured Vite to use port 5000 and host 0.0.0.0 for Replit environment
- Set up HMR with WebSocket protocol for development
- Configured workflow for automatic application startup
- Verified application functionality in Replit environment

## User Preferences
- No specific user preferences documented yet

## External Services
- **Supabase**: Backend-as-a-Service integration (configuration in `src/integrations/supabase/`)
