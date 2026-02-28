"use client";

import { RequestBookDTO, RequestBookSchema } from "@/app/(application)/books/server/book.schema";
import { useBook, useBookOptions, useFormBook } from "@/app/(application)/books/server/use.book";
import { LogData } from "@/components/log";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ComboboxForm } from "@/components/ui/form/combobox";
import { EnhancedCreatableCombobox } from "@/components/ui/form/createable.combobox";
import { ImageUploadForm } from "@/components/ui/form/image.upload";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { SmartTextareaForm } from "@/components/ui/form/smart-text/main";
import { YearForm } from "@/components/ui/form/year";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, SaveAll, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
const UIBookSchema = RequestBookSchema.extend({
    // Override untuk mengakomodasi input dari UI sebelum di-transform
    categories: z.array(z.string()).min(1, "Pilih minimal satu kategori"),
    authors: z.array(z.string()).min(1, "Pilih minimal satu penulis"),
    cover: z
        .any()
        .refine(
            (file) => file instanceof File || typeof file === "string" || file === null,
            "Cover harus berupa file gambar",
        ),
});

type UIBookDTO = z.input<typeof UIBookSchema>;
export function EditBook() {
    const { id } = useParams();
    const { detail } = useBook(undefined, String(id));
    const options = useBookOptions();
    const { update, isPending } = useFormBook(String(id));

    const categoriesOptions =
        options.data?.category?.map((c) => ({ value: c.name, label: c.name })) || [];
    const authorOptions =
        options.data?.author?.map((a) => ({
            value: Number(a.id),
            label: `${a.first_name} ${a.last_name}`,
        })) || [];
    const publisherOptions =
        options.data?.publisher?.map((p) => ({ value: p.name, label: p.name })) || [];

    const isLoading = options.isLoading || options.isFetching || isPending;

    const form = useForm<Partial<UIBookDTO>>({
        resolver: zodResolver(UIBookSchema.partial()),
        defaultValues: {
            title: "",
            authors: [],
            categories: [],
            description: "",
            language: "ID",
            status: "ACTIVE",
            publish_year: new Date().getFullYear(),
            publisher: { name: "" },
            cover: null,
            pages: null,
            isbn: "",
        },
    });

    useEffect(() => {
        if (detail.data) {
            form.reset({
                ...detail.data, // Spread data dasar (title, isbn, dll)
                cover: detail.data.cover_url || null,
                publisher: {
                    id: detail.data.publisher?.id,
                    name: detail.data.publisher?.name,
                },
                // Mapping Authors: Mengambil ID saja untuk UI Combobox
                authors: detail.data.authors?.map((a: any) => String(a.id)) || [],

                // Mapping Categories: Sesuaikan!
                // Jika di response ada slug: c.slug. Jika hanya ID: Number(c.id)
                categories: detail.data.categories?.map((c: any) => c.slug || String(c.name)) || [],

                pages: Number(detail.data.pages),
                publish_year: detail.data.publish_year,
            });
        }
    }, [detail.data, form]);

    const onSubmit = async (values: any) => {
        // Lakukan transformasi di sini sebelum kirim ke update()
        const formattedPayload: RequestBookDTO = {
            ...values,
            authors: values.authors.map((id: number) => ({ author_id: Number(id) })),
            categories: values.categories.map((cat: string) => ({ name: cat })),
            pages: Number(values.pages),
        };

        await update({ body: formattedPayload, cover: values.cover });
    };

    return (
        <Card className="max-w-7xl shadow-sm border rounded-xl overflow-hidden pb-0">
            <CardHeader className="flex flex-col lg:flex-row justify-between border-b pb-5">
                <div className="flex gap-4">
                    <Link href={"/books"}>
                        <Button variant="outline" size="icon" className="transition-all rounded-lg">
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <div>
                        <CardTitle className="font-bold text-2xl tracking-tight flex items-center gap-2">
                            <BookOpen className="h-6 w-6 hidden md:block" /> Edit Buku
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Update data buku ke dalam koleksi perpustakaan.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-6 space-y-8">
                    {/* SECTION 1: MAIN INFO & COVER */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
                        <div className="lg:col-span-8 space-y-5">
                            <InputForm
                                label="Judul Utama"
                                name="title"
                                control={form.control}
                                required
                                placeholder="Contoh: Laskar Pelangi"
                                error={form.formState.errors.title}
                                disabled={isLoading}
                                className="text-lg"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <EnhancedCreatableCombobox
                                    multiple
                                    control={form.control}
                                    name="categories"
                                    options={categoriesOptions}
                                    label="Kategori / Genre"
                                    placeholder="Pilih kategori..."
                                    isLoading={isLoading}
                                />
                                <div className="flex items-end gap-2">
                                    <EnhancedCreatableCombobox
                                        multiple
                                        control={form.control}
                                        name="authors"
                                        options={authorOptions}
                                        label="Penulis"
                                        placeholder="Pilih penulis..."
                                        isLoading={isLoading}
                                        className="flex-1"
                                    />
                                    <Link
                                        href={`/authors/create?ref=books/${detail.data?.id}/edit`}
                                    >
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="rounded-lg border-dashed"
                                        >
                                            <Plus size={18} strokeWidth={2} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <SmartTextareaForm
                                label="Sinopsis / Deskripsi"
                                name="description"
                                maxLength={500}
                                control={form.control}
                                error={form.formState.errors.description}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-4">
                                <ImageUploadForm
                                    control={form.control}
                                    name="cover"
                                    label="Cover Visual"
                                    description="Format: WEBP, JPG, PNG. Max 2MB"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-dashed border-gray-200" />

                    {/* SECTION 2: METADATA */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold text-sm tracking-tight text-muted-foreground">
                            <Info size={16} /> Detail Publikasi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <InputForm
                                name="isbn"
                                label="ISBN"
                                control={form.control}
                                type="text"
                                placeholder="978-..."
                                error={form.formState.errors.isbn}
                            />
                            <YearForm
                                name="publish_year"
                                control={form.control}
                                label="Tahun Terbit"
                            />
                            <InputForm
                                name="pages"
                                label="Jumlah Halaman"
                                control={form.control}
                                type="number"
                                placeholder="0"
                            />
                            <ComboboxForm
                                label="Bahasa"
                                name="language"
                                control={form.control}
                                options={[
                                    { value: "ID", label: "Bahasa Indonesia" },
                                    { value: "EN", label: "English" },
                                    { value: "JP", label: "Japanese" },
                                ]}
                                placeholder="Pilih bahasa"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <EnhancedCreatableCombobox
                                control={form.control}
                                name="publisher.name"
                                options={publisherOptions}
                                label="Penerbit"
                                placeholder="Cari penerbit..."
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t p-6">
                    <div className="flex flex-col md:flex-row w-full items-center justify-between gap-3">
                        <div className="text-sm text-center md:text-start text-muted-foreground">
                            Pastikan data sudah benar sebelum menyimpan.
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer transition-all font-semibold px-8 h-12 rounded-lg"
                        >
                            {isLoading ? (
                                "Memproses..."
                            ) : (
                                <>
                                    <SaveAll className="mr-2" strokeWidth={2} /> Simpan Koleksi
                                </>
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </Form>
        </Card>
    );
}
