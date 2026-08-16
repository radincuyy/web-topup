"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Pencil, Plus, Trash2 } from "lucide-react";

import {
  createKategori,
  deleteKategori,
  updateKategori,
} from "@/lib/admin/kategori-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Kategori = {
  id: string;
  nama: string;
  slug: string;
  urutan: number;
};

const kategoriFormSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  urutan: z.coerce.number().int().min(0, "Urutan minimal 0"),
});

type KategoriFormValues = z.infer<typeof kategoriFormSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function KategoriManager({ kategoriList }: { kategoriList: Kategori[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kategori</h1>
        <KategoriDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Urutan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kategoriList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada kategori.
              </TableCell>
            </TableRow>
          ) : (
            kategoriList.map((k) => <KategoriRow key={k.id} kategori={k} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function KategoriRow({ kategori }: { kategori: Kategori }) {
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleteError(null);
    const result = await deleteKategori(kategori.id);
    if (result.error) {
      setDeleteError(result.error);
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{kategori.nama}</TableCell>
      <TableCell className="text-muted-foreground">{kategori.slug}</TableCell>
      <TableCell>{kategori.urutan}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <KategoriDialog kategori={kategori} />
          <AlertDialog onOpenChange={() => setDeleteError(null)}>
            <AlertDialogTrigger render={<Button variant="outline" size="icon-sm" />}>
              <Trash2 />
              <span className="sr-only">Hapus {kategori.nama}</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus kategori {kategori.nama}?</AlertDialogTitle>
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

function KategoriDialog({ kategori }: { kategori?: Kategori }) {
  const isEdit = !!kategori;
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof kategoriFormSchema>, unknown, KategoriFormValues>({
    resolver: zodResolver(kategoriFormSchema),
    defaultValues: kategori ?? { nama: "", slug: "", urutan: 0 },
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

  async function onSubmit(values: KategoriFormValues) {
    setServerError(null);
    const result = isEdit
      ? await updateKategori({ id: kategori.id, ...values })
      : await createKategori(values);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    if (!isEdit) reset();
    setOpen(false);
  }

  const formId = isEdit ? `edit-kategori-${kategori.id}` : "add-kategori-form";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setServerError(null);
      }}
    >
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="outline" size="icon-sm" />
          ) : (
            <Button size="sm" />
          )
        }
      >
        {isEdit ? (
          <>
            <Pencil />
            <span className="sr-only">Ubah {kategori.nama}</span>
          </>
        ) : (
          <>
            <Plus data-icon="inline-start" />
            Tambah Kategori
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Ubah ${kategori.nama}` : "Tambah Kategori"}</DialogTitle>
        </DialogHeader>
        <form
          id={formId}
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
            <Label htmlFor={`${formId}-nama`}>Nama</Label>
            <Input
              id={`${formId}-nama`}
              placeholder="Game"
              aria-invalid={!!errors.nama}
              {...namaField}
              onChange={handleNamaChange}
            />
            {errors.nama ? (
              <p className="text-sm text-destructive">{errors.nama.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-slug`}>Slug</Label>
            <Input
              id={`${formId}-slug`}
              placeholder="game"
              aria-invalid={!!errors.slug}
              {...slugField}
              onChange={handleSlugChange}
            />
            {errors.slug ? (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-urutan`}>Urutan</Label>
            <Input
              id={`${formId}-urutan`}
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
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
