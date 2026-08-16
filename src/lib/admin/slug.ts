import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1, "Slug wajib diisi")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung");
