import { cn } from "@/lib/utils/cn";
import { labelize } from "@/lib/utils/format";

const toneByValue: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closed: "border-slate-200 bg-slate-100 text-slate-700",
  archived: "border-zinc-200 bg-zinc-100 text-zinc-700",
  excellent: "border-emerald-200 bg-emerald-50 text-emerald-800",
  good: "border-cyan-200 bg-cyan-50 text-cyan-800",
  partial: "border-amber-200 bg-amber-50 text-amber-800",
  poor: "border-rose-200 bg-rose-50 text-rose-800",
  manual: "border-indigo-200 bg-indigo-50 text-indigo-800",
  unsupported: "border-slate-200 bg-slate-100 text-slate-700",
  unknown: "border-slate-200 bg-white text-slate-700",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  edited: "border-cyan-200 bg-cyan-50 text-cyan-800",
  rejected: "border-rose-200 bg-rose-50 text-rose-800",
  ignored: "border-slate-200 bg-slate-100 text-slate-700"
};

export function StatusBadge({
  value,
  label,
  className
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        toneByValue[value] ?? "border-slate-200 bg-white text-slate-700",
        className
      )}
    >
      {label ?? labelize(value)}
    </span>
  );
}
