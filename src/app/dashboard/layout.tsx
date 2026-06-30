"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  GraduationCap,
  Gear,
  SignOut,
  List as ListIcon,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth";
import { LearncityLogo, LearncityMark } from "@/components/brand";
import { cn, initialsFrom } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour, exact: true },
  { href: "/dashboard/bootcamps", label: "Students", icon: GraduationCap, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Gear, exact: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, ready, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LearncityMark className="h-12 w-12 animate-pulse" />
      </div>
    );
  }

  function isActive(item: (typeof NAV)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const navList = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-soft text-brand-strong"
                : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
            )}
          >
            <Icon weight={active ? "fill" : "regular"} className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <LearncityLogo />
      </div>
      <div className="flex-1 px-3">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          Manage
        </p>
        {navList}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#10b981,#50b347)" }}
          >
            {initialsFrom(session.email)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              Administrator
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session.email}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="focus-ring mt-1 flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <SignOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[268px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-surface lg:block">
        {sidebarInner}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
        <LearncityLogo className="h-7" />
        <button
          onClick={() => setMobileOpen(true)}
          className="focus-ring rounded-md p-2 text-foreground"
          aria-label="Open menu"
        >
          <ListIcon className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[82%] bg-surface shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="focus-ring absolute right-3 top-4 rounded-md p-2 text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarInner}
          </div>
        </div>
      )}

      <main className="min-w-0">{children}</main>
    </div>
  );
}
