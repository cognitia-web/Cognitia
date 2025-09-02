# StudyHub - Universal Study Platform

## Overview

StudyHub is a comprehensive, AI-powered study platform designed to help students learn more effectively through structured daily habits and intelligent content management. The application features a full-stack architecture built with React, Express.js, and PostgreSQL, offering AI-generated flashcards, Q&A assistance, task-based scheduling, spaced repetition learning, and a gamified rewards system that progresses users from Bronze to Energon levels.

The platform enforces daily discipline by requiring users to create at least one task each day before accessing other features, promoting consistent study habits. Key capabilities include PDF/text content processing for flashcard generation, customizable AI model selection, automatic timetable creation, and smart revision scheduling based on spaced repetition algorithms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client application uses React 18 with TypeScript, built with Vite for optimal development experience. The UI leverages shadcn/ui components built on Radix UI primitives, providing a modern design system with Tailwind CSS for styling. State management is handled through TanStack Query (React Query) for server state and React Hook Form with Zod validation for form management.

The routing system uses Wouter for lightweight client-side navigation, with protected routes ensuring authentication before accessing core features. The component architecture follows a modular pattern with separate directories for UI components, layout components, study features, planning tools, and rewards systems.

### Backend Architecture
The server runs on Node.js with Express.js, implementing a RESTful API architecture. The codebase uses ESModules throughout for modern JavaScript standards. Database operations are managed through Drizzle ORM with PostgreSQL, providing type-safe database queries and migrations.

Authentication is handled through Replit's OpenID Connect integration using Passport.js, with session management via PostgreSQL session storage. The API includes comprehensive error handling, request logging, and CORS configuration for cross-origin requests.

### Database Design
The PostgreSQL database schema includes core tables for users, tasks, flashcard decks, Q&A history, revision topics, points tracking, and session management. Key relationships include user-owned tasks and decks, flashcard-to-deck associations, and points events linked to user activities.

The schema supports complex features like spaced repetition tracking with interval calculations, task scheduling with intensity levels, and comprehensive user preference storage including AI model defaults and UI settings.

### AI Integration Strategy
Multiple AI service integrations are supported through a flexible service layer, with OpenAI as the primary provider (GPT-4 default, with GPT-5 capability noted in code). The system includes fallback mechanisms and user-selectable models for different use cases.

AI services handle flashcard generation from various content sources (text, PDF, URL), intelligent Q&A with multiple response modes (concise, explanatory, exam-style), and content processing for educational materials. The architecture allows for easy addition of alternative AI providers like Anthropic Claude or Google Gemini.

### Gamification and Progress Tracking
A comprehensive points and leveling system drives user engagement through a progression ladder from Bronze to Energon levels. Points are awarded for various activities including task completion, streak maintenance, flashcard accuracy, and revision consistency.

The system tracks user streaks, maintains detailed points history, and provides visual progress indicators throughout the interface. Level thresholds are configurable, with each level unlock providing enhanced features and recognition.

## External Dependencies

### Database and Infrastructure
- **PostgreSQL**: Primary database using Neon serverless for scalable hosting
- **Drizzle ORM**: Type-safe database operations with migration support
- **Session Storage**: PostgreSQL-based session management with connect-pg-simple

### AI and Machine Learning Services
- **OpenAI API**: Primary AI service for GPT-4/GPT-5 integration
- **Anthropic Claude**: Secondary AI option for content generation
- **Multiple AI Models**: Configurable model selection per feature type

### Authentication and Security
- **Replit Auth**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware with OIDC strategy
- **Session Management**: Secure session handling with HTTP-only cookies

### Frontend Libraries and UI
- **React 18**: Core frontend framework with TypeScript
- **TanStack Query**: Server state management and caching
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Form handling with Zod schema validation

### Development and Build Tools
- **Vite**: Fast development server and build tool
- **ESBuild**: JavaScript bundling and optimization
- **TypeScript**: Static type checking throughout the codebase
- **Replit Development**: Integration with Replit's development environment

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **Wouter**: Lightweight client-side routing
- **Zod**: Runtime type validation and schema definition
- **Lucide React**: Icon library for consistent iconography