import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tenant entitlements cache. Reads numeric limits from `tenant_entitlement(tenant, key)`
 * and feature flags from `tenant_has_feature(tenant, flag)`. -1 / Infinity = unlimited.
 *
 * Usage:
 *   const { limit, hasFeature, loading } = useEntitlements(tenantId);
 *   limit("max_users") → number | null
 *   hasFeature("ai_enabled") → boolean
 */
export function useEntitlements(tenantId: string | null | undefined) {
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLimits({});
      setFlags({});
      return;
    }
    setLoading(true);
    setError(null);

    (async () => {
      // Pull the active subscription's plan once, then read all entitlements + flags from it
      const { data: sub, error: subErr } = await supabase
        .from("subscriptions")
        .select("id, plan_id, plans:plan_id(feature_flags, plan_entitlements(key, limit_value))")
        .eq("tenant_id", tenantId)
        .in("status", ["trial", "active", "past_due"])
        .maybeSingle();

      if (subErr) {
        setError(subErr.message);
        setLoading(false);
        return;
      }

      const plan = (sub as any)?.plans;
      const ent: Record<string, number> = {};
      for (const e of (plan?.plan_entitlements ?? []) as any[]) {
        ent[e.key] = Number(e.limit_value);
      }
      const ff = (plan?.feature_flags ?? {}) as Record<string, boolean>;

      setLimits(ent);
      setFlags(ff);
      setLoading(false);
    })();
  }, [tenantId]);

  const limit = useCallback(
    (key: string): number | null => {
      if (!(key in limits)) return null;
      return limits[key];
    },
    [limits]
  );

  const isUnlimited = useCallback(
    (key: string) => limits[key] === -1,
    [limits]
  );

  const hasFeature = useCallback(
    (flag: string): boolean => Boolean(flags[flag]),
    [flags]
  );

  const withinLimit = useCallback(
    (key: string, current: number): boolean => {
      const l = limits[key];
      if (l === undefined) return true;
      if (l === -1) return true;
      return current < l;
    },
    [limits]
  );

  return { limits, flags, limit, isUnlimited, hasFeature, withinLimit, loading, error };
}