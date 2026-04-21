import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Package } from "@/data/packagesData";
import type { FeatureCatalogRow } from "./usePackagesData";

/** Slugify a plan name into a stable code (a-z0-9_, 32 chars max). */
function toCode(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 32) || `plan_${Date.now()}`;
}

/** Split a Package's features by catalog into entitlements (numeric) and flags (boolean/text). */
function splitFeatures(plan: Package, catalog: FeatureCatalogRow[]) {
  const entitlements: { key: string; limit_value: number }[] = [];
  const flags: Record<string, any> = {};
  for (const c of catalog) {
    const v = (plan.features as any)[c.key];
    if (v === undefined) continue;
    if (c.value_type === "limit" || c.value_type === "retention") {
      entitlements.push({ key: c.key, limit_value: Number(v) || 0 });
    } else {
      flags[c.key] = v;
    }
  }
  return { entitlements, flags };
}

export function usePackageMutations(catalog: FeatureCatalogRow[]) {
  const [saving, setSaving] = useState(false);

  /** Insert or update a plan + sync its entitlements + feature_flags. */
  const upsertPackage = useCallback(
    async (plan: Package, isCreating: boolean) => {
      setSaving(true);
      try {
        const { entitlements, flags } = splitFeatures(plan, catalog);

        const planRow = {
          name: plan.name,
          code: toCode(plan.name),
          description: plan.description || null,
          price_monthly: plan.price,
          price_yearly: plan.yearlyPrice,
          feature_flags: flags,
          is_active: plan.status === "active",
          is_popular: !!plan.isPopular,
          is_trial: !!plan.isTrial,
          plan_kind: plan.type,
          color: plan.color,
        };

        let planId = plan.id;
        if (isCreating) {
          const { data, error } = await supabase
            .from("plans")
            .insert(planRow)
            .select("id")
            .single();
          if (error) throw error;
          planId = data.id;
        } else {
          const { error } = await supabase
            .from("plans")
            .update(planRow)
            .eq("id", planId);
          if (error) throw error;
        }

        // Replace entitlements: delete then insert (small set, simpler than diffing)
        const { error: delErr } = await supabase
          .from("plan_entitlements")
          .delete()
          .eq("plan_id", planId);
        if (delErr) throw delErr;

        if (entitlements.length > 0) {
          const { error: insErr } = await supabase
            .from("plan_entitlements")
            .insert(entitlements.map(e => ({ ...e, plan_id: planId })));
          if (insErr) throw insErr;
        }

        return planId;
      } finally {
        setSaving(false);
      }
    },
    [catalog]
  );

  const archivePackage = useCallback(async (planId: string) => {
    const { error } = await supabase.from("plans").update({ is_active: false }).eq("id", planId);
    if (error) throw error;
  }, []);

  const duplicatePackage = useCallback(
    async (plan: Package) => {
      const copy: Package = {
        ...plan,
        id: "new",
        name: `${plan.name} (Copy)`,
        isPopular: false,
        subscriberCount: 0,
        mrr: 0,
        features: { ...plan.features },
      };
      return upsertPackage(copy, true);
    },
    [upsertPackage]
  );

  return { upsertPackage, archivePackage, duplicatePackage, saving };
}