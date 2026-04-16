---
name: User Tier Separation (Platform vs Tenant)
description: Hard separation between platform admins and tenant users via profiles.user_tier + DB triggers. Login pages enforce tier match.
type: feature
---

# Hard Tier Separation

## What's enforced
`profiles.user_tier` is an enum `('platform' | 'tenant')` (NOT NULL, default `'tenant'`).
Triggers prevent ANY mismatch:

| Action | Block condition |
|---|---|
| Insert/update on `tenant_members` | user_tier = 'platform' → reject |
| Insert/update on `user_roles` with `tenant_id IS NULL` | user_tier ≠ 'platform' → reject |
| Insert/update on `user_roles` with `tenant_id` set | user_tier ≠ 'tenant' → reject |
| Update `profiles.user_tier` | only `super_admin` may change it; cannot switch if existing memberships/roles would be violated |

## Login enforcement (client side, in addition to triggers)
- `/app/admin/login` → after sign-in, if `user_tier !== 'platform'` → signOut + error
- `/tenant/login` → after sign-in, if `user_tier === 'platform'` → signOut + error

## Helper
`get_user_tier(_user_id uuid) returns user_tier` — security definer, available in RLS.

## Auth context
`AuthContext.profile.user_tier` is loaded with the profile and exposed via `useAuth()`.

## Why this matters
- Same `auth.users` table is still shared (single sign-in pipeline, MFA, password rules).
- But platform admins and tenant users are **structurally** unable to cross over — even a buggy admin UI cannot accidentally add a platform admin to a tenant.
