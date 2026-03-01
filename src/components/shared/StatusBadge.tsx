type Status = "active" | "inactive" | "draft" | "pending" | "completed" | "suspended" | "trial" | "expired" | string;

const statusConfig: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  active:    { label: "Active",    dotColor: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
  inactive:  { label: "Inactive",  dotColor: "bg-gray-400",    bgColor: "bg-gray-50",    textColor: "text-gray-600" },
  draft:     { label: "Draft",     dotColor: "bg-gray-400",    bgColor: "bg-gray-50",    textColor: "text-gray-500" },
  pending:   { label: "Pending",   dotColor: "bg-amber-500",   bgColor: "bg-amber-50",   textColor: "text-amber-700" },
  completed: { label: "Completed", dotColor: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
  suspended: { label: "Suspended", dotColor: "bg-rose-500",    bgColor: "bg-rose-50",    textColor: "text-rose-700" },
  trial:     { label: "Trial",     dotColor: "bg-blue-500",    bgColor: "bg-blue-50",    textColor: "text-blue-700" },
  expired:   { label: "Expired",   dotColor: "bg-rose-500",    bgColor: "bg-rose-50",    textColor: "text-rose-600" },
  published: { label: "Published", dotColor: "bg-primary",     bgColor: "bg-primary/8",  textColor: "text-primary" },
  archived:  { label: "Archived",  dotColor: "bg-gray-400",    bgColor: "bg-gray-50",    textColor: "text-gray-500" },
  free:      { label: "Free",      dotColor: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
  paid:      { label: "Paid",      dotColor: "bg-purple-500",  bgColor: "bg-purple-50",  textColor: "text-purple-700" },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? { label: status, dotColor: "bg-gray-400", bgColor: "bg-gray-50", textColor: "text-gray-600" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${config.bgColor} ${config.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {label ?? config.label}
    </span>
  );
}
