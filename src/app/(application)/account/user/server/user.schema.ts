import z from "zod";
export const optionalString = (schema: z.ZodString) =>
    z.preprocess(
        (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
        schema.optional(),
    );
export const UserSchema = z.object({
    first_name: z.string("Nama depan tidak boleh kosong").max(100),
    last_name: z.string("Nama belakang tidak valid").max(100).optional(),
    photo: z.string("Foto tidak valid").optional(),
    phone: z
        .string()
        .trim()
        .transform((v) => (v === "" ? undefined : v))
        .refine((v) => v === undefined || /^\d+$/.test(v), {
            message: "No. HP harus berupa angka",
        })
        .refine((v) => v === undefined || v.length <= 20, {
            message: "No. HP tidak valid",
        })
        .optional(),
    whatsapp: z
        .string()
        .trim()
        .transform((v) => (v === "" ? undefined : v))
        .refine((v) => v === undefined || /^\d+$/.test(v), {
            message: "No. Whatsapp harus berupa angka",
        })
        .refine((v) => v === undefined || v.length <= 20, {
            message: "No. Whatsapp tidak valid",
        })
        .optional(),
});

export const ResponseUserSchema = UserSchema.extend({
    id: z.string("Id tidak boleh kosong"),
    created_at: z.date(),
    updated_at: z.date(),
});

export type RequestUserDTO = z.input<typeof UserSchema>;
export type ResponseUserDTO = z.infer<typeof ResponseUserSchema>;
