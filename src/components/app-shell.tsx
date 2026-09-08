"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PRIMARY_NAV } from "@/lib/ui/nav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-full max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-paper-raised px-5 py-8 lg:flex">
          <Brand />
          <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Primary">
            {PRIMARY_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-muted hover:bg-paper hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-8 text-xs leading-5 text-muted">
            Personal Wisconsin salesperson coach. Course files stay on this machine.
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-line bg-paper-raised/90 px-4 py-4 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <Brand compact />
            </div>
            <nav
              className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1"
              aria-label="Primary"
            >
              {PRIMARY_NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                      active
                        ? "bg-accent text-white"
                        : "bg-paper text-muted ring-1 ring-line"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main id="main" className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <p className="font-display text-lg leading-none tracking-tight text-ink">
        Exam Coach
      </p>
      {!compact ? (
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
          Wisconsin salesperson
        </p>
      ) : (
        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
          Wisconsin
        </p>
      )}
    </div>
  );
}
