<div align="center">

# GiveMeMoney

**Crypto donations for streamers. Zero fees. Instant payouts.**

Accept BTC, ETH, SOL and other cryptocurrencies directly on your stream with real-time OBS alerts.

[Getting Started](#getting-started) · [Architecture](#architecture) · [API Reference](#api-endpoints) · [Contributing](#contributing)

</div>

---

## About

GiveMeMoney is an open-source platform that connects streamers with their audience through cryptocurrency donations. Streamers connect their Twitch or Kick accounts alongside their crypto wallets (MetaMask, Phantom) to receive donations with real-time alerts displayed directly in OBS via WebSocket.

### Key Features

- **Multi-chain support** — Accept donations in BTC, ETH, SOL and more
- **Platform integration** — Connect Twitch and Kick accounts via OAuth
- **Real-time alerts** — WebSocket-powered OBS overlay notifications
- **Customizable overlays** — Design your own alert layout, colors and animations
- **QR code donations** — Viewers scan and donate in seconds
- **Zero platform fees** — Donations go directly to the streamer's wallet

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| UI | Tailwind CSS v4, shadcn/ui, Radix UI |
| State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion, GSAP, OGL (WebGL) |
| Icons | Phosphor Icons |
| Backend | Go 1.25+, Gin, GORM, PostgreSQL |
| Real-time | Gorilla WebSocket |

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm or yarn

### Installation

```bash
git clone https://github.com/yuribodo/givememoney.git
cd givememoney/givememoney-front
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=              # openssl rand -base64 32
TWITCH_CLIENT_ID=             # from dev.twitch.tv
TWITCH_CLIENT_SECRET=         # from dev.twitch.tv
NEXT_PUBLIC_BACKEND_URL=http://localhost:9090
```

### Development

```bash
npm run dev        # Start dev server with Turbopack (port 3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
```

## Architecture

The frontend follows a **feature-based organization** with Next.js App Router route groups:

```
app/
├── (marketing)/           # Landing page (public)
├── (auth)/                # Login & register (public)
├── (dashboard)/           # Protected dashboard, overlay pages
├── api/                   # API routes
├── layout.tsx             # Root layout, metadata & providers
├── robots.ts              # SEO robots configuration
└── sitemap.ts             # Dynamic sitemap generation

components/
├── ui/                    # shadcn/ui primitives
├── layout/                # Shared layout (Footer, etc.)
└── seo/                   # Structured data (JSON-LD)

features/
├── auth/                  # Authentication (OAuth, sessions)
├── dashboard/             # Dashboard views & metrics
├── marketing/             # Landing page sections
├── layout/                # Alert & QR code customizers
├── overlay/               # OBS overlay preview
├── transactions/          # Donation transactions
├── wallet/                # Wallet connection (MetaMask, Phantom)
└── websocket/             # Real-time WebSocket communication

lib/
├── api-client.ts          # Type-safe API client with Zod validation
├── api-schemas.ts         # API response schemas
├── backend-types.ts       # Shared type definitions
├── validators.ts          # Zod validation schemas
└── site-config.ts         # Site-wide configuration
```

Each feature module follows a consistent structure:

```
features/<module>/
├── components/            # React components
├── hooks/                 # Custom hooks
├── services/              # API service layer
└── types/                 # TypeScript types
```

## API Endpoints

The frontend communicates with a Go backend. Key endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Email registration |
| `POST` | `/api/auth/login` | Email login |
| `POST` | `/api/auth/refresh` | Refresh JWT token |
| `GET` | `/api/auth/twitch/login` | Twitch OAuth flow |
| `GET` | `/api/auth/kick/login` | Kick OAuth flow |
| `POST` | `/api/auth/wallet` | Connect wallet |
| `POST` | `/api/transaction` | Create donation |
| `GET` | `/api/ws/alerts/:streamer_id` | WebSocket alerts (OBS) |

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

Built with Next.js and Go.

[givememoney.fun](https://givememoney.fun)

</div>
