import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AuthErrorPage({
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
