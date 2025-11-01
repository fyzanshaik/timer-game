# Almost Timer 🎮

A fast-paced reflexes game built with React and Cloudflare infrastructure.

## Tech Stack

- **Frontend**: React + TanStack Router/Query + Vite + Tailwind CSS
- **Backend**: Hono + Cloudflare Workers + D1 (SQLite) + KV Cache
- **Database**: Drizzle ORM
- **Deployment**: Cloudflare Pages & Workers

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9.12.0
- Cloudflare account

### Setup

```bash
# Install dependencies
pnpm install

# Setup Cloudflare resources (D1 database, KV namespaces)
wrangler d1 create timer-game-db
wrangler kv:namespace create CACHE

# Update apps/api/wrangler.toml with your database_id and namespace id

# Generate and run migrations
cd packages/db && pnpm db:generate
cd ../../apps/api && pnpm db:migrate

# Start development servers
cd ../.. && pnpm dev
```

Visit `http://localhost:5173` for the web app and `http://localhost:8787` for the API.

## Project Structure

```
├── apps/
│   ├── api/          # Hono API (Cloudflare Worker)
│   └── web/          # React SPA
├── packages/
│   ├── db/           # Drizzle ORM schema
│   └── types/        # Shared TypeScript types
└── .github/workflows/ # CI/CD
```

## Scripts

```bash
pnpm dev          # Run all apps
pnpm build        # Build all packages
pnpm lint         # Lint code
pnpm format       # Format code with Prettier
pnpm type-check   # Type check
pnpm deploy       # Deploy to Cloudflare
```

## Git Hooks

Pre-commit hooks automatically run on every commit to:

- ✨ Format code with Prettier
- 🔍 Lint with ESLint (auto-fix issues)

Type checking is done in CI/CD for faster commits. See [HOOKS.md](./HOOKS.md) for details.

## Game Challenges

- **Quick Reflex** (1s)
- **Speed Test** (5s)
- **Endurance** (10s)
- **Focus Mode** (15s)
- **Ultimate Challenge** (30s)

Stop the timer as close to 0ms remaining for max points (100)!

## License

MIT
