"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { primaryNavItems } from "./nav-items";
import { cn } from "@/lib/utils/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Link href="/mri" className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-950 text-white">
            <LockKeyhole size={18} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold">MyFinAssist</span>
            <span className="block text-xs text-slate-500">Private finance close</span>
          </span>
        </Link>
        <nav className="mt-8 space-y-1">
          {primaryNavItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href.startsWith("/settings") && pathname.startsWith("/settings"));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  active && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white"
                )}
              >
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/mri" className="text-sm font-semibold">
            MyFinAssist
          </Link>
          <nav className="flex gap-1 overflow-x-auto">
            {primaryNavItems.slice(0, 5).map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-md text-slate-600",
                    active && "bg-slate-950 text-white"
                  )}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={17} aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
