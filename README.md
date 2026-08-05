# openwitness

Open-source platform for preserving, organizing, and verifying evidence from public events.

## Database (Neon + Prisma)

1. Copy `.env.example` → `.env` and set Neon `DATABASE_URL` (pooler) + `DIRECT_URL` (non-pooler).
2. Install and migrate:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

See [`packages/db/README.md`](packages/db/README.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/RBAC.md`](docs/RBAC.md), and [`docs/MODULES.md`](docs/MODULES.md).

## Apps

```bash
pnpm dev
```

Runs the Next.js app under `apps/web`.
