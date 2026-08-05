# OpenWitness Architecture

## Spine

Modular monolith (WebDesk-style), not microservices:

```
User → Active Role → ModuleMatrix → Allowed modules/APIs → Domain data scoped by organizationId
```

## Layout

| Path | Role |
|------|------|
| `apps/web` | Next.js UI |
| `apps/api` | NestJS API (Sprint 2+) |
| `packages/db` | Prisma schema, client, seeds |
| `packages/shared` | Shared types/helpers (later) |
| `docs/` | Architecture, RBAC, modules |

## Data layer

- **Postgres** on Neon (dev); Prisma migrations
- Every mutable entity: `deleted`, timestamps, optional `createdById` / `updatedById`
- Domain rows carry `organizationId` when org-scoped
- Evidence files are versioned (`EvidenceVersion`); originals are not overwritten
- Privileged actions write `AuditLog`

## Auth (Sprint 2)

- Email/password
- Short-lived JWT access payload: `{ userId, sessionId }`
- Hashed refresh token + `sessionId` rotation on login/logout/password change
- `GET /auth/session` returns profile + active role + **menu filtered by ModuleMatrix**

## API grammar (Nest)

`controller → service → repository → dto` per feature under `apps/api/src/modules/<feature>/`.

No microservices until explicitly requested (Phase 5).
