import Link from "next/link";
import { Suspense } from "react";
import { Zap } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 font-heading text-lg font-semibold">
          <Zap className="size-5 fill-primary text-primary" />
          Top Up
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Suspense fallback={<div className="h-8 w-32" />}>
            <UserNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
