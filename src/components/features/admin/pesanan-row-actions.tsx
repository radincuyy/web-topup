"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

import { cancelOrderAdmin, syncOrderStatusAdmin } from "@/lib/admin/pesanan-actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TERMINAL_STATUSES = new Set(["selesai", "gagal", "dibatalkan"]);

export function PesananRowActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSync() {
    startTransition(async () => {
      const result = await syncOrderStatusAdmin(orderId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.note) {
        toast.info(result.note);
        return;
      }
      toast.success(`Status diperbarui: ${result.nextStatus}`);
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelOrderAdmin(orderId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Pesanan dibatalkan.");
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isPending}
      >
        <RefreshCw data-icon="inline-start" />
        Sinkronisasi
      </Button>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending || TERMINAL_STATUSES.has(status)}
            />
          }
        >
          Batalkan
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan pesanan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan mengubah status pesanan menjadi Dibatalkan dan
              tidak bisa diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              Ya, batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
