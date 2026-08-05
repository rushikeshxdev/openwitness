# @openwitness/db

Postgres access for OpenWitness via Prisma (Neon in development).

## Setup

1. Copy root `.env.example` → `.env` and set Neon URLs:

```env
DATABASE_URL="postgresql://...@...-pooler....neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://...@....neon.tech/neondb?sslmode=require"
```

`DIRECT_URL` must use the **non-pooler** host (no `-pooler`) for migrations.

2. From repo root:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Create/apply migrations (dev) |
| `pnpm db:seed` | Seed catalog, roles, matrices, admin |
| `pnpm db:studio` | Open Prisma Studio |

## Seed admin (local only)

- Email: `admin@openwitness.local`
- Password: `ChangeMeAdmin!123`

Change immediately outside local/dev.
