"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { PackageCheck } from "lucide-react";

import { tandaiTerkirimAdmin } from "@/lib/admin/pesanan-actions";
import { Button } from "@/components/ui/button";

/**
 * The one action Admin takes over and over (see docs/adr/0005) — promoted
 * to a real button instead of living inside the secondary-actions dropdown.
 */
export function TandaiTerkirimButton({
  orderId,
  size = "sm",
}: {
  orderId: string;
  size?: "sm" | "default";
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await tandaiTerkirimAdmin(orderId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Pesanan ditandai terkirim.");
    });
  }

  return (
    <Button size={size} disabled={isPending} onClick={handleClick}>
      <PackageCheck />
      Tandai Terkirim
    </Button>
  );
}
