---
name: Route Architecture
description: Final route namespaces — /app/admin/* for platform admin, /tenant/login + /tenant/:code/* for tenants. Custom-domain branded login deferred.
type: feature
---

# Routes (final after migration)

## Platform Admin — `/app/admin/*`
- `/app/admin/login` — Invite-only sign-in (no signup form)
- `/app/admin/dashboard` — Main admin dashboard
- `/app/admin/profile` — User profile
- `/app/admin/users`, `/app/admin/roles`, `/app/admin/tenants`, `/app/admin/packages`, `/app/admin/license`, `/app/admin/audit`
- `/app/admin/workforce/employees`
- `/app/admin/org/{chart,units,positions,locations}`
- `/app/admin/marketplace`, `/app/admin/master-data`
- `/app/admin/settings/*` (nested settings layout)

All `/app/admin/*` routes (except `/app/admin/login`) are wrapped in `RequireAuth`.

## Tenant — `/tenant/*`
- `/tenant/login` — Generic tenant login. After auth, resolves user's tenant via `tenant_members` and redirects to `/tenant/<code>/dashboard`.
- `/tenant/:tenantCode/dashboard` — Tenant dashboard (wrapped in `RequireTenantAccess`)
- `TenantPicker` is REMOVED — no public tenant directory.

## 3-tier model
- **Platform** = AchievHR (issues licenses)
- **Tenant** = a company (license holder, billing entity) — one user per tenant enforced via `UNIQUE(tenant_members.user_id)`
- **Organization** = sub-entity under a tenant (NOT YET BUILT — schema to be added later)

## Legacy redirects
All old `/admin/*`, `/dashboard`, `/users`, `/tenant`, `/tenant/:code/login` paths redirect to their new equivalents.

## Deferred (Phase: Custom Domains)
- Tenants verify a custom domain (CNAME + TXT) in their settings
- When a user visits that domain, app boot calls `getTenantByDomain(window.location.hostname)` and renders the branded tenant login
- Requires: `tenant_domains` table, DNS verification edge function, admin approval workflow, Lovable hosting custom domain setup
- Reference: EduSphere Hub project for pattern
