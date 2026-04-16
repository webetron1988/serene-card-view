---
name: Role Model & Permission Storage
description: Fixed roles, custom-role tables (platform vs tenant), permission catalog, role_permissions grants, audit-everywhere, RLS scope.
type: feature
---

# Role Model

## Fixed roles (system enum, non-deletable, non-renamable)

| Role | Tier | Editable by | Visible to Admin? | Notes |
|---|---|---|---|---|
| `super_admin` | platform | nobody | ❌ hidden | Always-full in code; grants mirrored in DB for completeness. Self-edit lock applies. |
| `admin` | platform | super_admin only | ✅ visible, disabled | Editable from PermissionMatrix by super_admin. Self-edit lock applies. |
| `tenant` | tenant (placeholder) | n/a in platform UI | ✅ visible, disabled | Tenant-tier role; managed in tenant workspace. Visible read-only on platform side. |

## Custom roles — TWO separate tables

- `platform_custom_roles` — created by platform admins. No `tenant_id`. RLS: only platform-tier users can read; only super_admin can mutate. Admin can create iff they hold `roles.create`.
- `tenant_custom_roles` — has `origin` enum: `platform_default` (template, tenant_id NULL, super_admin manages) or `tenant_custom` (tenant_id required, tenant admins manage). Platform admins **cannot see** `tenant_custom` rows — strict tenant data isolation.

## Permission catalog

- `permissions` table is the single source of truth (key, category, label, description, tier_scope, is_destructive, sort_order).
- `tier_scope` enum: `platform` | `tenant` | `both` — controls which matrix it appears in.
- Read-only for all authenticated; only super_admin writes. Code-managed via migrations.

## Grants — `role_permissions` (polymorphic)

- Columns: `role_kind` (`system` | `platform_custom` | `tenant_custom`), `role_ref` (enum value for system, UUID for custom), `permission_key`.
- Unique `(role_kind, role_ref, permission_key)`.
- `super_admin` grants mirrored in DB but treated as "always-full" in app code.

## Self-edit lock (universal)

The currently logged-in viewer's own system-role column is ALWAYS disabled in the Permission Matrix — even for super_admin. Prevents privilege drift / lockout.

## Viewer scope (Permission Matrix)

- **super_admin viewer** → sees all role columns including super_admin (own column disabled).
- **admin viewer** → super_admin column hidden entirely. Admin column visible but disabled. Custom roles editable iff admin has `roles.manage`.

## Custom role creation gating

- super_admin: always allowed.
- admin: allowed only when admin role has the `roles.create` permission.
- Plan gating at platform level: deferred.

## Audit-everywhere principle (apply across the platform)

Every mutation on sensitive tables auto-logs to `audit_log` via DB triggers (`audit_role_change` function). The `audit_log` table is append-only — RLS allows INSERT + SELECT only, no UPDATE/DELETE. This pattern must be applied to every new sensitive table going forward.

Currently audited: `platform_custom_roles`, `tenant_custom_roles`, `role_permissions`.

## Future (tenant phase)

- Seed `tenant_custom_roles` with `origin='platform_default'` rows for tenant_admin, hr_admin, etc.
- Tenant admins get their own Permission Matrix scoped to their tenant; same self-edit lock applies.
- Tenant matrix reads `permissions` where `tier_scope IN ('tenant','both')`.
