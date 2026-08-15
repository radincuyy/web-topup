"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

import {
  createNominal,
  setNominalTersedia,
  updateNominalHarga,
} from "@/lib/admin/produk-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Nominal = {
  id: string;
  nama: string;
  harga: number;
  tersedia: boolean;
};

const nominalFormSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  harga: z.coerce.number().int().positive("Harga harus lebih dari 0"),
});

type NominalFormValues = z.infer<typeof nominalFormSchema>;

const hargaFormSchema = z.object({
  harga: z.coerce.number().int().positive("Harga harus lebih dari 0"),
});

type HargaFormValues = z.infer<typeof hargaFormSchema>;

export function NominalManager({
  produkId,
  produkSlug,
  nominalList,
}: {
  produkId: string;
  produkSlug: string;
  nominalList: Nominal[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Nominal</h2>
        <AddNominalDialog produkId={produkId} produkSlug={produkSlug} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Tersedia</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nominalList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada nominal.
              </TableCell>
            </TableRow>
          ) : (
            nominalList.map((n) => (
              <NominalRow key={n.id} nominal={n} produkSlug={produkSlug} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function NominalRow({
  nominal,
  produkSlug,
}: {
  nominal: Nominal;
  produkSlug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [tersedia, setTersedia] = useState(nominal.tersedia);

  function toggleTersedia(checked: boolean) {
    setTersedia(checked);
    startTransition(async () => {
      const result = await setNominalTersedia({
        nominalId: nominal.id,
        produkSlug,
        tersedia: checked,
      });
      if (result.error) {
        setTersedia(!checked);
      }
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{nominal.nama}</TableCell>
      <TableCell>Rp{nominal.harga.toLocaleString("id-ID")}</TableCell>
      <TableCell>
        <Switch
          checked={tersedia}
          onCheckedChange={toggleTersedia}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className="text-right">
        <EditHargaDialog nominal={nominal} produkSlug={produkSlug} />
      </TableCell>
    </TableRow>
  );
}

function AddNominalDialog({
  produkId,
  produkSlug,
}: {
  produkId: string;
  produkSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof nominalFormSchema>, unknown, NominalFormValues>({
    resolver: zodResolver(nominalFormSchema),
  });

  async function onSubmit(values: NominalFormValues) {
    setServerError(null);
    const result = await createNominal({ produkId, produkSlug, ...values });
    if (result.error) {
      setServerError(result.error);
      return;
    }
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" />
        Tambah Nominal
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Nominal</DialogTitle>
        </DialogHeader>
        <form
          id="add-nominal-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {serverError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              placeholder="86 Diamond"
              aria-invalid={!!errors.nama}
              {...register("nama")}
            />
            {errors.nama ? (
              <p className="text-sm text-destructive">{errors.nama.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="harga">Harga (Rp)</Label>
            <Input
              id="harga"
              type="number"
              placeholder="20000"
              aria-invalid={!!errors.harga}
              {...register("harga")}
            />
            {errors.harga ? (
              <p className="text-sm text-destructive">{errors.harga.message}</p>
            ) : null}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="add-nominal-form" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditHargaDialog({
  nominal,
  produkSlug,
}: {
  nominal: Nominal;
  produkSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof hargaFormSchema>, unknown, HargaFormValues>({
    resolver: zodResolver(hargaFormSchema),
    defaultValues: { harga: nominal.harga },
  });

  async function onSubmit(values: { harga: number }) {
    setServerError(null);
    const result = await updateNominalHarga({
      nominalId: nominal.id,
      produkSlug,
      harga: values.harga,
    });
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Ubah Harga
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Harga — {nominal.nama}</DialogTitle>
        </DialogHeader>
        <form
          id={`edit-harga-form-${nominal.id}`}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {serverError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`harga-${nominal.id}`}>Harga (Rp)</Label>
            <Input
              id={`harga-${nominal.id}`}
              type="number"
              aria-invalid={!!errors.harga}
              {...register("harga")}
            />
            {errors.harga ? (
              <p className="text-sm text-destructive">{errors.harga.message}</p>
            ) : null}
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form={`edit-harga-form-${nominal.id}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
