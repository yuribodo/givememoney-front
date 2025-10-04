# GiveMeMoney - Frontend

A modern, high-performance Next.js application for GiveMeMoney, a platform that connects streamers with wallet providers for receiving cryptocurrency donations. Built with Next.js 15, React 19, and a cutting-edge tech stack.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with React 19
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom design system
- **Authentication**: [NextAuth.js v5](https://authjs.dev) (beta) with JWT strategy
- **UI Components**: [Radix UI](https://www.radix-ui.com) primitives following [shadcn/ui](https://ui.shadcn.com) patterns
- **Forms**: [React Hook Form](https://react-hook-form.com) with [Hookform Resolvers](https://github.com/react-hook-form/resolvers)
- **Validation**: [Zod](https://zod.dev) for schema validation
- **Animation**: [Framer Motion](https://www.framer.com/motion) & [GSAP](https://gsap.com)
- **3D Graphics**: [OGL](https://oframe.github.io/ogl) (WebGL library)
- **Icons**: [Phosphor Icons](https://phosphoricons.com)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query v5)
- **TypeScript**: Full type safety with strict mode

## 📋 Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

## 🛠️ Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd givememoney-front

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Required environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Twitch OAuth
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Development

Start the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Build the production application:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm run start
```

### Linting

Run ESLint for code quality checks:

```bash
npm run lint
```

## 📁 Project Structure

This project follows a **feature-based organization pattern** optimized for medium-scale applications (50-200 components):

```
givememoney-front/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing pages route group
│   │   ├── page.tsx             # Landing page
│   │   └── components/          # Marketing-specific components
│   ├── (auth)/                  # Authentication route group
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── _components/    # Route-specific components
│   │   └── register/
│   ├── dashboard/               # Dashboard routes
│   │   └── page.tsx
│   └── api/                     # API routes
├── features/                     # Feature-based modules
│   ├── marketing/               # Marketing feature logic
│   ├── dashboard/               # Dashboard feature logic
│   └── overlay/                 # Overlay customization feature
├── components/                   # Shared components
│   ├── ui/                      # shadcn/ui components
│   └── layout/                  # Layout components
├── lib/                         # Utilities & helpers
├── hooks/                       # Global/shared hooks
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

### Structure Guidelines

- **Route Groups**: `(marketing)`, `(auth)`, `(dashboard)` for logical page grouping without affecting URLs
- **Features**: Business logic organized by domain (`features/auth/`, `features/dashboard/`)
- **Route-specific code**: `_components/` directories contain page-specific components (underscore prefix excludes from routing)
- **Shared components**: Global UI components in `components/ui/` and `components/layout/`

### Import Patterns

```typescript
// Shared UI components
import { Button } from '@/components/ui/button'

// Feature imports
import { LoginForm } from '@/features/auth'

// Route-specific imports
import { HeroSection } from './components/HeroSection'

// Utilities
import { cn } from '@/lib/utils'
```

## ✨ Key Features

### Landing Page
- **Hero Section**: Eye-catching introduction with WebGL animations
- **Quick Setup**: Step-by-step guide for getting started
- **Platform Integration**: Showcase of supported platforms and wallets
- **Final CTA**: Conversion-optimized call-to-action

### Authentication System
- **NextAuth.js v5**: Configured with JWT strategy
- **Twitch OAuth**: Ready for integration (backend connection pending)
- **Custom Sign-in**: Custom login page at `/login`
- **Session Management**: Client-side session handling with `SessionProvider`

### Dashboard
- **User Dashboard**: Personalized dashboard for streamers
- **Overlay Customization**: Customizable donation overlays for streams
- **Settings**: User preferences and configuration

### UI Components
- **shadcn/ui Patterns**: Consistent component library following shadcn/ui standards
- **Radix UI Primitives**: Accessible, unstyled components
- **Variant System**: `class-variance-authority` for component variants
- **Phosphor Icons**: Duotone icons throughout the application

## 🏗️ Architecture

### Authentication Flow
- NextAuth.js v5 (beta) with JWT strategy configured in `middleware.ts`
- Protected routes with automatic redirects
- Twitch OAuth integration (ready for backend API)
- Custom sign-in page with modern UI

### Feature-Based Organization
Each feature module contains:
- `components/` - Feature-specific UI components
- `hooks/` - Feature-specific React hooks
- `services/` - API calls and data fetching
- `types/` - TypeScript interfaces and types

### Component Standards
- **shadcn/ui Compatibility**: All UI components follow shadcn/ui patterns
- **Variant-Based Extension**: Use `cva` to add variants instead of creating wrapper components
- **Full Type Safety**: All components are fully typed with TypeScript
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA attributes

## 🎨 Design System

### Icon System
- **Default Weight**: Duotone for consistent two-toned aesthetic
- **Standard Sizes**:
  - Small: `size={16}` (inline elements)
  - Medium: `size={20}` (buttons, inputs)
  - Large: `size={24}` (headers)
  - Extra Large: `size={32}+` (hero sections)

### Interactive Elements
- **Cursor**: All interactive elements use `cursor-pointer`
- **Hover Effects**: Container scaling (`hover:scale-105`) with smooth transitions
- **Consistent Feedback**: Visual feedback on all clickable elements

## 🚢 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Ensure all environment variables are configured in your deployment platform:

- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Secure random string
- `TWITCH_CLIENT_ID` - Twitch OAuth client ID
- `TWITCH_CLIENT_SECRET` - Twitch OAuth client secret

### Build Optimization

The application is optimized with:
- Turbopack for faster builds
- Automatic code splitting
- Image optimization with `next/image`
- Font optimization with `next/font`

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### UI/UX Guidelines
- [Radix UI Documentation](https://www.radix-ui.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)

### Authentication
- [NextAuth.js Documentation](https://authjs.dev)
- [Twitch OAuth Guide](https://dev.twitch.tv/docs/authentication)


## 📄 License

All rights reserved.
