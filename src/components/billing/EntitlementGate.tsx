import type { ReactNode } from "react";
import { Lock, Sparkles } from "lucide-react";
import { useEntitlements } from "@/hooks/useEntitlements";
import { Button } from "@/components/ui/button";

interface EntitlementGateProps {
  tenantId: string | null | undefined;
  /** Required feature flag (boolean on plan.feature_flags). */
  feature?: string;
  /** Required numeric entitlement: blocks when current >= limit (unless unlimited / undefined). */
  limitKey?: string;
  current?: number;
  /** What to render when allowed. */
  children: ReactNode;
  /** Custom blocked UI. Defaults to an upgrade card. */
  fallback?: ReactNode;
  /** Render nothing when blocked. */
  silent?: boolean;
  /** Optional CTA when blocked (defaults to /app/admin/packages). */
  upgradeHref?: string;
}

export function EntitlementGate({
  tenantId,
  feature,
  limitKey,
  current = 0,
  children,
  fallback,
  silent,
  upgradeHref = "/app/admin/packages",
}: EntitlementGateProps) {
  const { hasFeature, limit, isUnlimited, loading } = useEntitlements(tenantId);

  if (loading) return null;

  let allowed = true;
  if (feature) allowed = allowed && hasFeature(feature);
  if (limitKey) {
    const l = limit(limitKey);
    if (l !== null && !isUnlimited(limitKey)) {
      allowed = allowed && current < l;
    }
  }

  if (allowed) return <>{children}</>;
  if (silent) return null;
  if (fallback !== undefined) return <>{fallback}</>;

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {feature ? "Feature not in your plan" : "Plan limit reached"}
        </p>
        <p className="text-xs text-muted-foreground">
          {feature
            ? `Upgrade to unlock ${feature.replace(/_/g, " ")}.`
            : `Your plan allows ${limit(limitKey!) ?? 0} ${limitKey?.replace(/^max_/, "")}.`}
        </p>
      </div>
      <Button size="sm" variant="outline" asChild>
        <a href={upgradeHref}>
          <Lock className="w-3.5 h-3.5 mr-1.5" /> Upgrade plan
        </a>
      </Button>
    </div>
  );
}