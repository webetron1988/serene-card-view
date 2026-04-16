---
name: Role Model & Edit Rules
description: Fixed roles (super_admin, admin, tenant), self-edit lock, viewer-scoped visibility, custom-role gating. Drives Permission Matrix and Roles pages.
type: feature
---

# Role Model

## Fixed roles (system, non-deletable, non-renamable)

| Role | Tier | Editable by | Visible to Admin? | Notes |
|---|---|---|---|---|
| `super_admin` | platform | nobody | ❌ hidden | All permissions always granted, all checkboxes disabled+ticked. |
| `admin` | platform | super_admin only | ✅ visible, disabled | Admin sees own column read-only. |
| `tenant` | tenant (placeholder) | n/a in platform UI | ✅ visible, disabled | Reserved for the tenant-tier login phase. Shown as locked badge "Tenant tier — managed in tenant workspace". |

Custom platform roles can also be created; they are editable by super_admin always, and by admin only when admin holds `roles:create`.

## Self-edit lock (universal)

The currently logged-in viewer's own role column is ALWAYS disabled in the Permission Matrix — even if the viewer is super_admin. Prevents privilege drift / lockout.

## Viewer scope (Permission Matrix)

- **super_admin viewer** → sees all role columns including super_admin (own column disabled).
- **admin viewer** → super_admin column is hidden entirely. Admin column visible but disabled. Custom roles editable iff admin has `roles:manage`.

## Custom role creation

- super_admin: always allowed.
- admin: allowed only when admin role has the `roles:create` permission.
- Plan gating at platform level: not applied (deferred — may add tier caps later).

## Future (tenant phase)

- The `tenant` placeholder will resolve to actual tenant-side fixed roles (`tenant_owner`, `tenant_admin`, etc.) defined in `mem://architecture/user-tiers`.
- Tenant admins will get their own Permission Matrix scoped to their tenant; same self-edit lock applies.
