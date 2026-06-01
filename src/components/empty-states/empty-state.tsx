import type { ReactNode } from "react";

export function EmptyState({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
      <p className="font-medium text-slate-900">{title}</p>
      <div className="mt-2 leading-6">{children}</div>
    </div>
  );
}
