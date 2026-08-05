# OpenWitness Modules & SubModules

Global catalog (seeded once). Roles receive a **subset** via `moduleMatrix`.

## Catalog

| moduleId | moduleKey | Name | Path | Submodules (subKey → permissionPath) |
|----------|-----------|------|------|--------------------------------------|
| 1 | `dashboard` | Dashboard | `/` | _(module `_self` only)_ |
| 2 | `events` | Events | `/events` | `list` → `events-list`; `detail` → `events-detail`; `report` → `events-report`; `map` → `events-map` |
| 3 | `evidence` | Evidence | `/evidence` | `list` → `evidence-list`; `upload` → `evidence-upload`; `detail` → `evidence-detail`; `compare` → `evidence-compare` |
| 4 | `verification` | Verification | `/verification` | `queue` → `verification-queue`; `decide` → `verification-decide` |
| 5 | `reports` | Reports | `/reports` | `list` → `reports-list`; `publish` → `reports-publish` |
| 6 | `organizations` | Organizations | `/organizations` | `list` → `organizations-list`; `detail` → `organizations-detail`; `manage` → `organizations-manage` |
| 7 | `notifications` | Notifications | `/notifications` | `list` → `notifications-list` |
| 8 | `profile` | Profile | `/profile` | `view` → `profile-view`; `settings` → `profile-settings` |
| 9 | `access` | Access | `/admin/access` | `users` → `access-users`; `roles` → `access-roles`; `modules` → `access-modules` |

## Default role assignments

| Role | Gets | Does not get |
|------|------|--------------|
| **Viewer** | dashboard; events list/detail/map (read); evidence list/detail/compare (read); orgs list/detail; profile view | report, upload, verification, access, publish, manage |
| **Contributor** | Viewer + events.report, evidence.upload, reports.list, notifications, profile.settings | verification.decide, access.*, organizations.manage |
| **Verifier** | Contributor + verification.queue + verification.decide | access.* |
| **Org Admin** | Contributor + organizations.manage + reports.publish | access.users/roles/modules (platform) |
| **Admin** | Entire catalog with action `[5]` | — |

## Assignment flow

1. Seed full `Module` + `SubModule` rows.
2. For each `Role`, upsert `RoleModuleMapping` with only assigned keys.
3. Attach roles to users via `UserRole`; set `User.activeRoleId`.
4. Session filters catalog through active role matrix before returning menu.
