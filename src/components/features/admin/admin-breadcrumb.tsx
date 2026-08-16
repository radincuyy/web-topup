"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getActiveAdminNavItem } from "@/components/features/admin/nav-config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const section = getActiveAdminNavItem(pathname);
  const isDetail = section ? pathname !== section.url : false;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className={isDetail ? "hidden md:block" : undefined}>
          {isDetail && section ? (
            <BreadcrumbLink render={<Link href={section.url} />}>
              {section.title}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{section?.title ?? "Admin"}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isDetail ? (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
