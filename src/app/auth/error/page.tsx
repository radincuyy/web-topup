import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<Card />}>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AuthErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terjadi kesalahan</CardTitle>
        <CardDescription>
          {params.error ?? "Terjadi kesalahan yang tidak diketahui."}
        </CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
