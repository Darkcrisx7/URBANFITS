import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-paper p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wideish text-stone-500">{label}</span>
        <Icon size={16} className="text-stone-400" />
      </div>
      <p className="mt-3 font-display text-2xl font-medium">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-xs", trend.positive ? "text-success" : "text-error")}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
}
