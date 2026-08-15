import Link from "next/link";
import { MailCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpSuccessPage() {
  return (
    <Card>
      <CardHeader>
        <MailCheck className="mb-2 size-8 text-primary" />
        <CardTitle>Cek email Anda</CardTitle>
        <CardDescription>
          Kami sudah mengirim tautan konfirmasi ke email Anda. Klik tautan itu
          untuk mengaktifkan akun sebelum masuk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: "outline", className: "w-full" })}
        >
          Kembali ke halaman masuk
        </Link>
      </CardContent>
    </Card>
  );
}
