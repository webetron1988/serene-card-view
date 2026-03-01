type Status = "active" | "inactive" | "draft" | "pending" | "completed" | "suspended" | "trial" | "expired" | string;

const statusConfig: Record<string, { label: string; classes: string }> = {
  active:    { label: "Active",    classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive:  { label: "Inactive",  classes: "bg-gray-100 text-gray-600 border-gray-200" },
  draft:     { label: "Draft",     classes: "bg-gray-100 text-gray-500 border-gray-200" },
  pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completed", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspended", classes: "bg-rose-50 text-rose-700 border-rose-200" },
  trial:     { label: "Trial",     classes: "bg-blue-50 text-blue-700 border-blue-200" },
  expired:   { label: "Expired",   classes: "bg-rose-50 text-rose-600 border-rose-200" },
  published: { label: "Published", classes: "bg-primary/10 text-primary border-primary/20" },
  archived:  { label: "Archived",  classes: "bg-gray-100 text-gray-500 border-gray-200" },
  free:      { label: "Free",      classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paid:      { label: "Paid",      classes: "bg-purple-50 text-purple-700 border-purple-200" },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? { label: status, classes: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label ?? config.label}
    </span>
  );
}
