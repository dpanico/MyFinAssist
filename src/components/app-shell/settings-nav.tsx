"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNavItems } from "./nav-items";
import { cn } from "@/lib/utils/cn";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
      {settingsNavItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              active && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white"
            )}
          >
            <Icon size={15} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
