# Memory: index.md
Updated: just now

# Project Memory

## Core
- Platform: AchievHR by inHRSight — enterprise talent management SaaS.
- Stack: React, Vite, Radix UI, Lucide React, Recharts, Lovable Cloud.
- Aesthetic: Modern minimalist, Inter font, minimal borders/shadows, generous whitespace.
- Layout: AppShell max-width 1600px, p-6/p-8. Pages are padding-less.
- Nav/Header: Minimalist. No page titles. Sidebar restricted to core modules.
- Core Principle: Every feature is plan-gated. Platform → Tenant → User field-level control.
- Routes: `/app/admin/*` for platform admin, `/tenant/login` (generic) + `/tenant/:code/*` for tenants. NO `TenantPicker` page.
- Tenancy: ONE user per tenant (DB-enforced). Tenant = license holder. Organizations live under a tenant (not yet built).
- Auth: Invite-only — no public signup. Admin login at `/app/admin/login`.
- Audit-everywhere: every sensitive table gets DB triggers writing to `audit_log` (append-only, no UPDATE/DELETE). Apply to all new sensitive tables.
- Tenant data isolation: platform admins MUST NOT see tenant-owned custom rows (e.g. `tenant_custom_roles` with origin='tenant_custom'). RLS enforces this.

## Memories
- [Platform Architecture Overview](mem://architecture/platform-overview) — 3-layer hierarchy, 11 build phases, current build status
- [Route Architecture](mem://architecture/routes) — /app/admin/* and /tenant/* namespaces, full route map, custom-domain plan
- [RBAC & Security](mem://architecture/rbac) — 8-layer permission chain, PII masking, role definitions, multi-role merge
- [Role Model & Permission Storage](mem://architecture/role-model) — Fixed roles, platform/tenant custom-role tables, permissions catalog, role_permissions grants, audit pattern
- [AI & Agentic Layer](mem://architecture/ai-agents) — AI Model CMS, 8 agents, conversational readiness, plan-gated keys
- [Aesthetic & Styling](mem://design/aesthetic) — Core design philosophy, fonts, and visual elements
- [Layout Architecture](mem://design/layout) — AppShell constraints and page padding rules
- [Navigation & Header Design](mem://design/navigation-header) — Sidebar and Header minimalism rules, profile dropdown
- [Lucide Icon Rendering](mem://tech/patterns/icon-rendering) — Handling Lucide forwardRef icons in shared components
- [Radix Select Empty Values](mem://tech/patterns/radix-select-empty-values) — Using __none__ placeholder for Radix Select
- [Settings Module](mem://features/settings) — Nested routing and comprehensive RBAC/Security settings
- [Packages Management](mem://features/packages-management) — Canvas Pro Hub style subscription management and tenant health
- [Multi-Tenancy](mem://features/multi-tenancy) — Scope of Super Admin vs future Client/Tenant routes
