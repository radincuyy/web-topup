"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Trash2 } from "lucide-react";

import { deleteProduk, setProdukAktif, updateProduk } from "@/lib/admin/produk-actions";
import {
  DESTINATION_FIELD_TYPES,
  destinationFieldTypeLabels,
} from "@/lib/orders/destination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  nama: string;
  slug: string;
  destination_field_type: string;
  kategori_id: string;
  urutan: number;
  aktif: boolean;
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

export function ProdukEditForm({
  produk,
  kategoriList,
}: {
  produk: Produk;
  kategoriList: Kategori[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [aktif, setAktif] = useState(produk.aktif);
  const [isAktifPending, startAktifTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof produkFormSchema>, unknown, ProdukFormValues>({
    resolver: zodResolver(produkFormSchema),
    defaultValues: {
      nama: produk.nama,
      slug: produk.slug,
      kategoriId: produk.kategori_id,
      destinationFieldType: produk.destination_field_type as ProdukFormValues["destinationFieldType"],
      urutan: produk.urutan,
    },
  });

  function toggleAktif(checked: boolean) {
    setAktif(checked);
    startAktifTransition(async () => {
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

  async function onSubmit(values: ProdukFormValues) {
    setServerError(null);
    const result = await updateProduk({ id: produk.id, ...values });
    if (result.error) {
      setServerError(result.error);
      return;
    }
    if (values.slug !== produk.slug) {
      router.push(`/admin/produk/${values.slug}`);
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    const result = await deleteProduk({ id: produk.id, slug: produk.slug });
    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    router.push("/admin/produk");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Produk</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {serverError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}
        <form
          id="edit-produk-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-produk-nama">Nama</Label>
            <Input
              id="edit-produk-nama"
              aria-invalid={!!errors.nama}
              {...register("nama")}
            />
            {errors.nama ? (
              <p className="text-sm text-destructive">{errors.nama.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-produk-slug">Slug</Label>
            <Input
              id="edit-produk-slug"
              aria-invalid={!!errors.slug}
              {...register("slug")}
            />
            {errors.slug ? (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-produk-kategori">Kategori</Label>
            <NativeSelect
              id="edit-produk-kategori"
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
            <Label htmlFor="edit-produk-destination">Tipe Tujuan</Label>
            <NativeSelect
              id="edit-produk-destination"
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
            <Label htmlFor="edit-produk-urutan">Urutan</Label>
            <Input
              id="edit-produk-urutan"
              type="number"
              aria-invalid={!!errors.urutan}
              {...register("urutan")}
            />
            {errors.urutan ? (
              <p className="text-sm text-destructive">{errors.urutan.message}</p>
            ) : null}
          </div>
        </form>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
          <div>
            <p className="text-sm font-medium">Aktif</p>
            <p className="text-xs text-muted-foreground">
              Produk nonaktif disembunyikan dari katalog publik.
            </p>
          </div>
          <Switch
            checked={aktif}
            onCheckedChange={toggleAktif}
            disabled={isAktifPending}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <AlertDialog onOpenChange={() => setDeleteError(null)}>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              <Trash2 />
              Hapus Produk
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
          <Button type="submit" form="edit-produk-form" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
