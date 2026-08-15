"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import { AlertCircle } from "lucide-react";

import { createOrder } from "@/lib/orders/actions";
import {
  destinationFieldLabels,
  destinationSchemas,
  type DestinationFieldType,
} from "@/lib/orders/destination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

type Nominal = { id: string; nama: string; harga: number };

export function CheckoutForm({
  produkId,
  destinationFieldType,
  nominalList,
}: {
  produkId: string;
  destinationFieldType: DestinationFieldType;
  nominalList: Nominal[];
}) {
  const router = useRouter();
  const [selectedNominal, setSelectedNominal] = useState<string | null>(
    nominalList[0]?.id ?? null,
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const schema = destinationSchemas[destinationFieldType];
  const fields = destinationFieldLabels[destinationFieldType];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(schema) as unknown as Resolver<
      Record<string, string>
    >,
  });

  async function onSubmit(values: Record<string, string>) {
    if (!selectedNominal) {
      setServerError("Pilih nominal dulu.");
      return;
    }

    setServerError(null);
    setSubmitting(true);
    const result = await createOrder({
      produkId,
      nominalId: selectedNominal,
      destinationData: values,
    });
    setSubmitting(false);

    if (!("snapToken" in result)) {
      setServerError(result.error);
      return;
    }

    window.snap?.pay(result.snapToken, {
      onSuccess: () => router.push(`/pesanan/${result.orderId}`),
      onPending: () => router.push(`/pesanan/${result.orderId}`),
      onError: () => setServerError("Pembayaran gagal diproses."),
      onClose: () => router.push(`/pesanan/${result.orderId}`),
    });
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Pilih Nominal</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {nominalList.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNominal(n.id)}
                  aria-pressed={selectedNominal === n.id}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2 text-left text-sm transition-all",
                    selectedNominal === n.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/25"
                      : "border-border hover:border-primary/40 hover:bg-muted",
                  )}
                >
                  <div className="font-medium">{n.nama}</div>
                  <div
                    className={
                      selectedNominal === n.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    Rp{n.harga.toLocaleString("id-ID")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {serverError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Gagal checkout</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            {fields.map((f) => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <Label htmlFor={f.field}>{f.label}</Label>
                <Input
                  id={f.field}
                  placeholder={f.placeholder}
                  aria-invalid={!!errors[f.field]}
                  {...register(f.field)}
                />
                {errors[f.field] ? (
                  <p className="text-sm text-destructive">
                    {String(errors[f.field]?.message)}
                  </p>
                ) : null}
              </div>
            ))}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="checkout-form"
            disabled={submitting || !selectedNominal}
            className="w-full"
          >
            {submitting ? "Memproses..." : "Beli Sekarang"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
