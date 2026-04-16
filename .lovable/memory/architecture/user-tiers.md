---
name: 3-Tier User Model
description: Platform / Tenant / Organization user tiers, role taxonomy per tier, and how user_roles scopes by tenant_id + (future) organization_id.
type: feature
---

# 3-Tier User Model

## Tiers

### 1. Platform (AchievHR)
- The vendor. Issues licenses to tenants.
- Login: `/app/admin/login`
- Role scope in `user_roles`: `tenant_id IS NULL`
- Roles: `super_admin`, `platform_admin`, `platform_auditor`, `support`

### 2. Tenant (license-holder company, e.g. "Acme Corp")
- One legal entity that owns the license + billing.
- Login: `/tenant/login` (or future custom domain)
- ONE tenant per user — DB-enforced via `UNIQUE(tenant_members.user_id)`.
- Role scope in `user_roles`: `tenant_id = <id>`, `organization_id IS NULL`
- Roles: `tenant_owner`, `tenant_admin`, `billing_admin`, `hr_director`, `tenant_auditor`
- These users see/manage ALL organizations under the tenant.

### 3. Organization (sub-entity under a tenant, e.g. "Acme India", "Acme US")
- NOT YET BUILT. Schema to be added in a dedicated phase.
- Login: same `/tenant/login`, then routed to their org dashboard.
- A user CAN belong to multiple organizations within their tenant.
- Role scope in `user_roles`: `tenant_id + organization_id` both set.
- Roles: `org_admin`, `hr_admin`, `hr_manager`, `manager`, `employee`, `auditor`

## Role-scope matrix (target shape)

| tenant_id | organization_id | Meaning |
|---|---|---|
| NULL | NULL | Platform-level role |
| set | NULL | Tenant-level role (sees all orgs in tenant) |
| set | set | Org-level role (scoped to one org) |

## Required schema changes when org phase begins

1. Add `organizations` table: `id, tenant_id, parent_org_id, code, name, branding, status`.
2. Add `organization_members` table: `(user_id, organization_id, is_primary)` — multi-org allowed within tenant.
3. Add `organization_id uuid NULL` column to `user_roles`.
4. Split `app_role` enum into the tiered roles above (migration with mapping from current generic roles).
5. New security-definer helpers: `is_org_member(_user, _org)`, `has_org_role(_user, _org, _role)`.
6. Update RLS on every tenant-scoped table to also check org scope where relevant.

## Current state (pre-org)

- `app_role` enum is generic: `super_admin, admin, consultant, hr_admin, employee, auditor`.
- Only platform + tenant tiers exist in code.
- All "org" pages under `/app/admin/org/*` are platform-admin views over tenant-org data, not org-scoped logins.
