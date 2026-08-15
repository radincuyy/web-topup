import { z } from "zod";

export type DestinationFieldType =
  | "ml_id_zone"
  | "user_id"
  | "riot_id"
  | "roblox_username"
  | "phone_number"
  | "meter_number";

export const destinationSchemas = {
  ml_id_zone: z.object({
    userId: z.string().min(1, "User ID wajib diisi"),
    zoneId: z.string().min(1, "Zone ID wajib diisi"),
  }),
  user_id: z.object({
    userId: z.string().min(1, "User ID wajib diisi"),
  }),
  riot_id: z.object({
    riotId: z.string().regex(/^.+#.+$/, "Format Riot ID: Username#Tag"),
  }),
  roblox_username: z.object({
    username: z.string().min(1, "Username wajib diisi"),
  }),
  phone_number: z.object({
    phoneNumber: z
      .string()
      .regex(/^08[0-9]{8,11}$/, "Nomor HP tidak valid (contoh: 081234567890)"),
  }),
  meter_number: z.object({
    meterNumber: z.string().min(1, "Nomor meter wajib diisi"),
  }),
} satisfies Record<DestinationFieldType, z.ZodType>;

export const destinationFieldLabels: Record<
  DestinationFieldType,
  { field: string; label: string; placeholder?: string }[]
> = {
  ml_id_zone: [
    { field: "userId", label: "User ID" },
    { field: "zoneId", label: "Zone ID" },
  ],
  user_id: [{ field: "userId", label: "User ID" }],
  riot_id: [
    { field: "riotId", label: "Riot ID", placeholder: "Username#Tag" },
  ],
  roblox_username: [{ field: "username", label: "Username Roblox" }],
  phone_number: [
    { field: "phoneNumber", label: "Nomor HP", placeholder: "081234567890" },
  ],
  meter_number: [{ field: "meterNumber", label: "Nomor Meter" }],
};
