"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

import { createProduk, deleteProduk, setProdukAktif } from "@/lib/admin/produk-actions";
import {
  DESTINATION_FIELD_TYPES,
  destinationFieldTypeLabels,
} from "@/lib/orders/destination";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Produk = {
  id: string;
  slug: string;
  nama: string;
  urutan: number;
  aktif: boolean;
  kategori: { nama: string; slug: string } | null;
};

type Kategori = { id: string; nama: string };

const produkFormSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  kategoriId: z.uuid("Pilih kategori"),
  destinationFieldType: z.enum(DESTINATION_FIELD_TYPES),
  urutan: z.coerce.number().int().min(0, "Urutan minimal 0"),
});

type ProdukFormValues = z.infer<typeof produkFormSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProdukList({
  produkList,
  kategoriList,
}: {
  produkList: Produk[];
  kategoriList: Kategori[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Produk</h1>
        <AddProdukDialog kategoriList={kategoriList} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategori</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Aktif</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produkList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada produk.
              </TableCell>
            </TableRow>
          ) : (
            produkList.map((p) => <ProdukRow key={p.id} produk={p} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ProdukRow({ produk }: { produk: Produk }) {
  const [isPending, startTransition] = useTransition();
  const [aktif, setAktif] = useState(produk.aktif);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function toggleAktif(checked: boolean) {
    setAktif(checked);
    startTransition(async () => {
      const result = await setProdukAktif({
        id: produk.id,
        slug: produk.slug,
        aktif: checked,
      });
      if (result.error) {
        setAktif(!checked);
      }
    });
  }

  async function handleDelete() {
    setDeleteError(null);
    const result = await deleteProduk({ id: produk.id, slug: produk.slug });
    if (result.error) {
      setDeleteError(result.error);
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Badge variant="outline">{produk.kategori?.nama}</Badge>
      </TableCell>
      <TableCell className="font-medium">{produk.nama}</TableCell>
      <TableCell>
        <Switch checked={aktif} onCheckedChange={toggleAktif} disabled={isPending} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/produk/${produk.slug}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Kelola
          </Link>
          <AlertDialog onOpenChange={() => setDeleteError(null)}>
            <AlertDialogTrigger render={<Button variant="outline" size="icon-sm" />}>
              <Trash2 />
              <span className="sr-only">Hapus {produk.nama}</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus produk {produk.nama}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak bisa diurungkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Gagal</AlertTitle>
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              ) : null}
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Ya, hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

function AddProdukDialog({ kategoriList }: { kategoriList: Kategori[] }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof produkFormSchema>, unknown, ProdukFormValues>({
    resolver: zodResolver(produkFormSchema),
    defaultValues: {
      nama: "",
      slug: "",
      kategoriId: kategoriList[0]?.id ?? "",
      destinationFieldType: DESTINATION_FIELD_TYPES[0],
      urutan: 0,
    },
  });

  const { onChange: onNamaChange, ...namaField } = register("nama");
  const { onChange: onSlugChange, ...slugField } = register("slug");

  function handleNamaChange(e: React.ChangeEvent<HTMLInputElement>) {
    onNamaChange(e);
    if (!slugTouched) {
      setValue("slug", slugify(e.target.value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSlugChange(e);
    setSlugTouched(true);
  }

  async function onSubmit(values: ProdukFormValues) {
    setServerError(null);
    const result = await createProduk(values);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    reset();
    setSlugTouched(false);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setServerError(null);
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" />
        Tambah Produk
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Produk</DialogTitle>
        </DialogHeader>
        <form
          id="add-produk-form"
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
            <Label htmlFor="produk-nama">Nama</Label>
            <Input
              id="produk-nama"
              placeholder="Mobile Legends"
              aria-invalid={!!errors.nama}
              {...namaField}
              onChange={handleNamaChange}
            />
            {errors.nama ? (
              <p className="text-sm text-destructive">{errors.nama.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="produk-slug">Slug</Label>
            <Input
              id="produk-slug"
              placeholder="mobile-legends"
              aria-invalid={!!errors.slug}
              {...slugField}
              onChange={handleSlugChange}
            />
            {errors.slug ? (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="produk-kategori">Kategori</Label>
            <NativeSelect
              id="produk-kategori"
              className="w-full"
              {...register("kategoriId")}
            >
              {kategoriList.map((k) => (
                <NativeSelectOption key={k.id} value={k.id}>
                  {k.nama}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.kategoriId ? (
              <p className="text-sm text-destructive">{errors.kategoriId.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="produk-destination">Tipe Tujuan</Label>
            <NativeSelect
              id="produk-destination"
              className="w-full"
              {...register("destinationFieldType")}
            >
              {DESTINATION_FIELD_TYPES.map((type) => (
                <NativeSelectOption key={type} value={type}>
                  {destinationFieldTypeLabels[type]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="produk-urutan">Urutan</Label>
            <Input
              id="produk-urutan"
              type="number"
              aria-invalid={!!errors.urutan}
              {...register("urutan")}
            />
            {errors.urutan ? (
              <p className="text-sm text-destructive">{errors.urutan.message}</p>
            ) : null}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="add-produk-form" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
