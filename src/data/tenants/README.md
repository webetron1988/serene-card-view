# Tenant Mock Data

Each tenant lives in its **own folder named by tenant code** (URL slug).
This makes per-tenant data isolation visually obvious in the codebase.

```
src/data/tenants/
├── acme/        ← tenant code "acme" → /tenant/acme/*
│   ├── branding.ts
│   ├── auth.ts
│   └── ...
└── globex/      ← tenant code "globex" → /tenant/globex/*
    ├── branding.ts
    ├── auth.ts
    └── ...
```

To add a new tenant:
1. Create a new folder under `src/data/tenants/` named with the tenant code
2. Copy `branding.ts` and `auth.ts` from an existing tenant and customise
3. Register the tenant in `src/data/platform/tenants.ts`
4. Optionally add a loader in `src/data/tenants/index.ts`

> **Note:** This is mock data only — used until Lovable Cloud is wired in
> Phase 2. At that point tenant config moves into the database, but the
> folder layout stays as a place for tenant-specific seed/static assets.
