import Link from "next/link";
import { Suspense } from "react";

import { UserNav } from "@/components/layout/user-nav";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-heading text-lg font-semibold">
          Top Up
        </Link>
        <Suspense fallback={<div className="h-8 w-32" />}>
          <UserNav />
        </Suspense>
      </div>
    </header>
  );
}
