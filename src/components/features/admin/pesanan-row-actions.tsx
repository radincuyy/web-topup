"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, PackageCheck, RefreshCw, Ban } from "lucide-react";

import {
  cancelOrderAdmin,
  syncOrderStatusAdmin,
  tandaiTerkirimAdmin,
} from "@/lib/admin/pesanan-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

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

  function handleTandaiTerkirim() {
    startTransition(async () => {
      const result = await tandaiTerkirimAdmin(orderId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Pesanan ditandai terkirim.");
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" disabled={isPending} />
          }
        >
          <MoreHorizontal />
          <span className="sr-only">Aksi pesanan</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSync}>
            <RefreshCw />
            Sinkronisasi Status
          </DropdownMenuItem>
          {status === "diproses" ? (
            <DropdownMenuItem onClick={handleTandaiTerkirim}>
              <PackageCheck />
              Tandai Terkirim
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            variant="destructive"
            disabled={TERMINAL_STATUSES.has(status)}
            onClick={() => setConfirmCancelOpen(true)}
          >
            <Ban />
            Batalkan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
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
    </>
  );
}
