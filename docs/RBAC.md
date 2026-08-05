# OpenWitness RBAC

## Model

Permissions are **not** a flat list on the user. They come from the **active role’s** `RoleModuleMapping.moduleMatrix`.

```
User ──M:N── Role
User ──1──── activeRoleId
Role ──1:1── RoleModuleMapping.moduleMatrix
```

Catalog tables `Module` and `SubModule` define the full product tree once.  
A role’s matrix contains **only** the modules/submodules assigned to that role. Omitted nodes = no menu, no API access.

## Action codes

| Code | Action |
|------|--------|
| 1 | read |
| 2 | write |
| 3 | modify |
| 4 | delete |
| 5 | all |

## Matrix shape

```json
{
  "evidence": {
    "_self": [1, 2],
    "upload": { "_self": [1, 2, 3] },
    "list": { "_self": [1] }
  }
}
```

Rules:

1. Checks use the **active role** only.
2. Parent `_self` does **not** grant child submodules.
3. `userType = admin` may bypass path checks; seed Admin still gets a full matrix.
4. Frontend never invents permissions — it renders `GET /auth/session` modules.

## Personas vs roles

Signup personas (`citizen`, `journalist`, …) are profile metadata.  
Authorization uses system roles: `viewer`, `contributor`, `verifier`, `org_admin`, `admin`.

## Enforcement (API — Sprint 2)

```ts
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions({ modulePath: 'evidence-upload', action: 'write' })
```

UI may hide buttons; API always re-checks.
