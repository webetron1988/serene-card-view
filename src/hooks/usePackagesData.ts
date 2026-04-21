import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Package, PackageFeatures, TenantSubscription } from "@/data/packagesData";

export interface FeatureCatalogRow {
  key: string;
  label: string;
  category: string;
  value_type: "boolean" | "limit" | "retention" | "text";
  sort_order: number;
  category_sort: number;
}

/** Build a sane default features object from the catalog. */
export function buildDefaultFeatures(catalog: FeatureCatalogRow[]): PackageFeatures {
  const f: any = {};
  for (const c of catalog) {
    if (c.value_type === "boolean") f[c.key] = false;
    else if (c.value_type === "limit") f[c.key] = 0;
    else if (c.value_type === "retention") f[c.key] = 30;
    else f[c.key] = "";
  }
  return f as PackageFeatures;
}

/** DB row shape for plans (with our new display columns). */
interface PlanRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_monthly: number | null;
  price_yearly: number | null;
  feature_flags: Record<string, any>;
  is_active: boolean;
  is_popular: boolean;
  is_trial: boolean;
  plan_kind: "free" | "paid";
  color: string;
  sort_order: number;
  trial_days: number;
  plan_entitlements?: { key: string; limit_value: number }[];
}

function planRowToPackage(p: PlanRow, catalog: FeatureCatalogRow[], stats: { count: number; mrr: number }): Package {
  const features = buildDefaultFeatures(catalog);

  // numeric limits + retention come from plan_entitlements
  const ents = new Map((p.plan_entitlements ?? []).map(e => [e.key, Number(e.limit_value)]));
  for (const c of catalog) {
    if (c.value_type === "limit" || c.value_type === "retention") {
      const v = ents.get(c.key);
      if (v !== undefined) (features as any)[c.key] = v;
    } else {
      // boolean + text features live in feature_flags JSON
      const v = (p.feature_flags ?? {})[c.key];
      if (v !== undefined) (features as any)[c.key] = v;
    }
  }

  return {
    id: p.id,
    name: p.name,
    type: p.plan_kind,
    price: Number(p.price_monthly ?? 0),
    yearlyPrice: Number(p.price_yearly ?? 0),
    interval: "monthly",
    description: p.description ?? "",
    features,
    isPopular: p.is_popular,
    isTrial: p.is_trial,
    subscriberCount: stats.count,
    mrr: stats.mrr,
    color: p.color,
    status: p.is_active ? "active" : "archived",
  };
}

export function usePackagesData() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptions, setSubscriptions] = useState<TenantSubscription[]>([]);
  const [catalog, setCatalog] = useState<FeatureCatalogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, plansRes, subsRes] = await Promise.all([
        supabase
          .from("feature_catalog")
          .select("key,label,category,value_type,sort_order,category_sort")
          .eq("is_active", true)
          .order("category_sort", { ascending: true })
          .order("sort_order", { ascending: true }),
        supabase
          .from("plans")
          .select(
            "id,code,name,description,price_monthly,price_yearly,feature_flags,is_active,is_popular,is_trial,plan_kind,color,sort_order,trial_days,plan_entitlements(key,limit_value)"
          )
          .order("sort_order", { ascending: true }),
        supabase
          .from("subscriptions")
          .select(
            "id,tenant_id,plan_id,status,trial_ends_at,current_period_end,seats,used_seats,billing_cycle,mrr_override,created_at,tenants(name,contact_email),plans(name,price_monthly,price_yearly)"
          ),
      ]);

      if (catRes.error) throw catRes.error;
      if (plansRes.error) throw plansRes.error;
      if (subsRes.error) throw subsRes.error;

      const cat = (catRes.data ?? []) as FeatureCatalogRow[];
      const planRows = (plansRes.data ?? []) as unknown as PlanRow[];
      const subRows = (subsRes.data ?? []) as any[];

      // ── Aggregate per-plan stats from subscriptions
      const statsByPlan = new Map<string, { count: number; mrr: number }>();
      for (const s of subRows) {
        if (!["active", "trial", "past_due"].includes(s.status)) continue;
        const key = s.plan_id as string;
        const cur = statsByPlan.get(key) ?? { count: 0, mrr: 0 };
        cur.count += 1;
        const monthly = Number(s.plans?.price_monthly ?? 0);
        const yearly = Number(s.plans?.price_yearly ?? 0);
        const mrr = s.mrr_override != null
          ? Number(s.mrr_override)
          : s.billing_cycle === "yearly"
            ? yearly / 12
            : monthly;
        if (s.status === "active" || s.status === "past_due") cur.mrr += mrr;
        statsByPlan.set(key, cur);
      }

      const pkgs = planRows.map(p =>
        planRowToPackage(p, cat, statsByPlan.get(p.id) ?? { count: 0, mrr: 0 })
      );

      const subs: TenantSubscription[] = subRows.map(s => {
        const monthly = Number(s.plans?.price_monthly ?? 0);
        const yearly = Number(s.plans?.price_yearly ?? 0);
        const mrr = s.mrr_override != null
          ? Number(s.mrr_override)
          : s.billing_cycle === "yearly"
            ? Math.round(yearly / 12)
            : monthly;
        const startDate = (s.created_at ?? "").slice(0, 10);
        const nextBilling = (s.current_period_end ?? "").slice(0, 10) || "—";
        const statusMap: Record<string, TenantSubscription["status"]> = {
          active: "active",
          trial: "trial",
          past_due: "suspended",
          canceled: "cancelled",
          expired: "expired",
        };
        return {
          id: s.id,
          tenantId: s.tenant_id,
          tenantName: s.tenants?.name ?? "—",
          tenantEmail: s.tenants?.contact_email ?? "",
          packageId: s.plan_id,
          packageName: s.plans?.name ?? "—",
          status: statusMap[s.status] ?? "expired",
          startDate,
          nextBillingDate: nextBilling,
          trialEndsAt: s.trial_ends_at ? s.trial_ends_at.slice(0, 10) : undefined,
          mrr: s.status === "trial" || s.status === "canceled" ? 0 : Math.round(mrr),
          billingCycle: s.billing_cycle,
          seats: s.seats ?? 0,
          usedSeats: s.used_seats ?? 0,
          paymentMethod: "card",
          totalRevenue: 0,
          healthScore: s.status === "active" ? 85 : s.status === "trial" ? 60 : 0,
        };
      });

      setCatalog(cat);
      setPackages(pkgs);
      setSubscriptions(subs);
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { packages, subscriptions, catalog, loading, error, refresh };
}