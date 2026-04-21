import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FeatureValueType = "boolean" | "limit" | "retention" | "text";

export interface FeatureCatalogItem {
  id: string;
  key: string;
  label: string;
  category: string;
  category_sort: number;
  sort_order: number;
  value_type: FeatureValueType;
  description: string | null;
  is_active: boolean;
}

export interface FeatureUsage {
  /** plans (by id+name) that have this key in feature_flags JSON */
  flagPlans: { id: string; name: string }[];
  /** plans (by id+name) that have a plan_entitlements row for this key */
  entitlementPlans: { id: string; name: string }[];
}

export function useFeatureCatalog() {
  const [items, setItems] = useState<FeatureCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("feature_catalog")
      .select("id,key,label,category,category_sort,sort_order,value_type,description,is_active")
      .order("category_sort", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    setItems((data ?? []) as FeatureCatalogItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /** Returns which plans currently use a given key (in feature_flags or plan_entitlements). */
  const inspectUsage = useCallback(async (key: string): Promise<FeatureUsage> => {
    const [flagsRes, entRes] = await Promise.all([
      supabase.from("plans").select("id,name,feature_flags"),
      supabase.from("plan_entitlements").select("plan_id,plans(name)").eq("key", key),
    ]);
    const flagPlans = (flagsRes.data ?? [])
      .filter((p: any) => p.feature_flags && Object.prototype.hasOwnProperty.call(p.feature_flags, key))
      .map((p: any) => ({ id: p.id, name: p.name }));
    const entitlementPlans = (entRes.data ?? []).map((r: any) => ({
      id: r.plan_id,
      name: r.plans?.name ?? "—",
    }));
    return { flagPlans, entitlementPlans };
  }, []);

  const create = useCallback(async (input: {
    key: string; label: string; category: string;
    value_type: FeatureValueType; sort_order?: number; category_sort?: number;
  }) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("feature_catalog").insert({
        key: input.key.trim(),
        label: input.label.trim(),
        category: input.category.trim(),
        value_type: input.value_type,
        sort_order: input.sort_order ?? 0,
        category_sort: input.category_sort ?? 0,
      });
      if (error) throw error;
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  const update = useCallback(async (id: string, patch: Partial<FeatureCatalogItem>) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("feature_catalog").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  /** Hard delete — caller must have confirmed no plans use the key. */
  const remove = useCallback(async (id: string) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("feature_catalog").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  /** Reorder items inside a category by writing new sort_order values. */
  const reorderWithinCategory = useCallback(async (category: string, orderedIds: string[]) => {
    setSaving(true);
    try {
      // 10-step gaps so future inserts can slot between
      const updates = orderedIds.map((id, idx) =>
        supabase.from("feature_catalog").update({ sort_order: (idx + 1) * 10 }).eq("id", id)
      );
      const results = await Promise.all(updates);
      const firstErr = results.find(r => r.error)?.error;
      if (firstErr) throw firstErr;
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  /** Move a category up/down by swapping category_sort values. */
  const reorderCategories = useCallback(async (orderedCategories: string[]) => {
    setSaving(true);
    try {
      const updates = orderedCategories.flatMap((cat, idx) => {
        const sort = (idx + 1) * 10;
        return [
          supabase.from("feature_catalog").update({ category_sort: sort }).eq("category", cat),
        ];
      });
      const results = await Promise.all(updates);
      const firstErr = results.find(r => r.error)?.error;
      if (firstErr) throw firstErr;
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  return {
    items, loading, saving, error,
    refresh, create, update, remove,
    reorderWithinCategory, reorderCategories, inspectUsage,
  };
}