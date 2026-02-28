import { STATUS } from "@/shared/types";
import z from "zod";

export const RequestPublisherSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string(),
});

export const RequestCategorySchema = z.object({
    name: z.string(),
});

export const RequestBookFile = z.object({
    file_url: z.string(),
    file_type: z.enum(["PDF", "EPUB"]),
    size_kb: z.number(),
    pages: z.number(),
});

export const RequestBookSchema = z.object({
    title: z.string().max(200),
    description: z.string().max(500).optional(),
    status: z.enum(STATUS).default("ACTIVE"),
    isbn: z.string().optional(),
    publish_year: z.coerce.number().optional(),
    language: z.string().optional(),
    pages: z.coerce.number().default(1).nullable(),
    authors: z
        .array(
            z.object({
                author_id: z.number(),
            }),
        )
        .optional(),

    categories: z.array(RequestCategorySchema),
    publisher: RequestPublisherSchema,
});

export const ResponseBookSchema = RequestBookSchema.extend({
    id: z.string(),
    slug: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date().optional(),
    cover_url: z.string().url().optional().nullable(),
    authors: z
        .array(z.object({ id: true, first_name: true, last_name: true, bio: true }))
        .optional(),

    book_files: z.array(RequestBookFile).optional(),
    categories: z.array(RequestCategorySchema.extend({ slug: z.string() })),
});

export type RequestBookDTO = z.input<typeof RequestBookSchema>;
export type ResponseBookDTO = z.input<typeof ResponseBookSchema>;

export type QueryBookDTO = {
    page: number;
    take: number;

    search?: string;
    status: "active" | "delete";
    sortOrder: "asc" | "desc";
    sortBy: "title" | "updated_at" | "publish_year";
    category_slug?: string;
    author?: string;
    publisher?: string;
    publish_year?: number;
    language?: string;
    pages?: number;
};
