import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Live tenant row joined with its current subscription + plan. */
export interface TenantRow {
  id: string;
  name: string;
  code: string;
  contactEmail: string | null;
  status: "trial" | "active" | "suspended" | "archived";
  createdAt: string;

  // From subscription (may be null if tenant has none yet)
  subscriptionId: string | null;
  planId: string | null;
  planName: string | null;
  planPriceMonthly: number;
  planPriceYearly: number;
  subStatus: "trial" | "active" | "past_due" | "canceled" | "expired" | null;
  billingCycle: "monthly" | "yearly" | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  seats: number;
  usedSeats: number;
  mrrOverride: number | null;

  // Derived
  mrr: number;
  healthScore: number;
}

function pickActiveSub(subs: any[]): any | null {
  if (!subs?.length) return null;
  const order = ["active", "trial", "past_due", "canceled", "expired"];
  return [...subs].sort(
    (a, b) => order.indexOf(a.status) - order.indexOf(b.status)
  )[0];
}

function computeMrr(sub: any): number {
  if (!sub) return 0;
  if (sub.status === "trial" || sub.status === "canceled" || sub.status === "expired") return 0;
  if (sub.mrr_override != null) return Math.round(Number(sub.mrr_override));
  const monthly = Number(sub.plans?.price_monthly ?? 0);
  const yearly = Number(sub.plans?.price_yearly ?? 0);
  return Math.round(sub.billing_cycle === "yearly" ? yearly / 12 : monthly);
}

function computeHealth(sub: any, seats: number, usedSeats: number): number {
  if (!sub) return 0;
  if (sub.status === "canceled" || sub.status === "expired") return 0;
  if (sub.status === "past_due") return 30;
  let base = sub.status === "active" ? 90 : sub.status === "trial" ? 60 : 50;
  // Penalise overcrowded seats
  if (seats > 0) {
    const pct = usedSeats / seats;
    if (pct >= 1) base -= 15;
    else if (pct >= 0.9) base -= 5;
  }
  return Math.max(0, Math.min(100, base));
}

export function useTenantsData() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("tenants")
        .select(
          `id,name,code,contact_email,status,created_at,
           subscriptions(id,plan_id,status,billing_cycle,current_period_end,trial_ends_at,seats,used_seats,mrr_override,
             plans(name,price_monthly,price_yearly))`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows: TenantRow[] = (data ?? []).map((t: any) => {
        const sub = pickActiveSub(t.subscriptions ?? []);
        const seats = sub?.seats ?? 0;
        const usedSeats = sub?.used_seats ?? 0;
        return {
          id: t.id,
          name: t.name,
          code: t.code,
          contactEmail: t.contact_email,
          status: t.status,
          createdAt: (t.created_at ?? "").slice(0, 10),

          subscriptionId: sub?.id ?? null,
          planId: sub?.plan_id ?? null,
          planName: sub?.plans?.name ?? null,
          planPriceMonthly: Number(sub?.plans?.price_monthly ?? 0),
          planPriceYearly: Number(sub?.plans?.price_yearly ?? 0),
          subStatus: sub?.status ?? null,
          billingCycle: sub?.billing_cycle ?? null,
          currentPeriodEnd: sub?.current_period_end?.slice(0, 10) ?? null,
          trialEndsAt: sub?.trial_ends_at?.slice(0, 10) ?? null,
          seats,
          usedSeats,
          mrrOverride: sub?.mrr_override != null ? Number(sub.mrr_override) : null,

          mrr: computeMrr(sub),
          healthScore: computeHealth(sub, seats, usedSeats),
        };
      });

      setTenants(rows);
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tenants, loading, error, refresh };
}