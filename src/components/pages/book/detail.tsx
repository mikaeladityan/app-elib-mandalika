"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
// Import dipindah ke bawah bersama useActionBook
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    BookOpen,
    Download,
    FileText,
    Calendar,
    Hash,
    Globe,
    User,
    Eye,
    Edit3,
    Trash2,
    Upload,
    X,
    Loader2,
    BookMarked,
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    useActionBook,
    useActionBookFile,
    useBook,
} from "@/app/(application)/books/server/use.book";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function DetailBook() {
    const { id } = useParams();
    const router = useRouter();
    const { detail } = useBook(undefined, String(id));
    const book = detail.data;
    const { deleteMany, isDeleting, restoreMany, isRestoring, destroyMany, isDestroying } =
        useActionBook();

    const {
        uploadFile: submitFile,
        isUploading,
        deleteFile,
        isDeletingFile,
    } = useActionBookFile(String(id));

    // Handle Upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ekstensi
        const allowedTypes = ["application/pdf", "application/epub+zip"];
        if (!allowedTypes.includes(file.type)) {
            alert("Hanya format PDF dan EPUB yang didukung!");
            return;
        }

        // Memastikan batasan ukuran (50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert(
                `Ukuran file maksimal: 50MB. Ukuran file ini: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
            );
            return;
        }

        try {
            await submitFile(file);
        } catch (error) {
            console.error(error);
        } finally {
            // Reset input file setelah upload sukses/gagal di tangani lewat event target value
            e.target.value = "";
        }
    };

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<"soft_delete" | "destroy" | "delete_file" | null>(
        null,
    );
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const handleConfirmAction = async () => {
        if (!actionType) return;

        if (actionType === "soft_delete") {
            await deleteMany([String(id)]);
            router.push("/books");
        } else if (actionType === "destroy") {
            await destroyMany([String(id)]);
            router.push("/books");
        } else if (actionType === "delete_file" && selectedFileId) {
            await deleteFile(selectedFileId);
        }
        setDialogOpen(false);
        setActionType(null);
        setSelectedFileId(null);
    };

    if (detail.isLoading) return <DetailLoading />;

    return (
        <section className="space-y-6">
            {/* 1. TOP BAR - Integrated with breadcrumb feel */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/books")}
                    className="gap-2 px-0 hover:bg-transparent text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-medium">Kembali ke Koleksi</span>
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/books/${id}/edit`)}
                        className="rounded-lg shadow-sm"
                    >
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    {book?.status === "DELETE" ? (
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                className="rounded-lg shadow-sm bg-indigo-600 hover:bg-indigo-700"
                                onClick={async () => {
                                    await restoreMany([String(id)]);
                                }}
                                disabled={isRestoring}
                            >
                                {isRestoring ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="mr-2 h-4 w-4" />
                                )}
                                Restore
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="rounded-lg shadow-sm"
                                onClick={() => {
                                    setActionType("destroy");
                                    setDialogOpen(true);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-lg shadow-sm"
                            onClick={() => {
                                setActionType("soft_delete");
                                setDialogOpen(true);
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </Button>
                    )}
                </div>
            </div>

            {/* CONFIRMATION DIALOG */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                        <DialogDescription>
                            {actionType === "soft_delete"
                                ? "Apakah Anda yakin ingin menghapus buku ini? Buku akan dipindahkan ke tempat sampah dan masih bisa dipulihkan kembali nantinya."
                                : actionType === "destroy"
                                  ? "Apakah Anda sangat yakin ingin MENGHAPUS PERMANEN buku ini? Tindakan ini tidak dapat dibatalkan dan semua data beserta file aset buku ini akan hilang selamanya."
                                  : "Apakah Anda yakin ingin menghapus file aset digital ini? File yang dihapus tidak dapat dipulihkan."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDialogOpen(false);
                                setActionType(null);
                                setSelectedFileId(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmAction}
                            disabled={isDeleting || isDestroying || isDeletingFile}
                        >
                            {isDeleting || isDestroying || isDeletingFile ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Ya,{" "}
                            {actionType === "soft_delete"
                                ? "Hapus"
                                : actionType === "destroy"
                                  ? "Hapus Permanen"
                                  : "Hapus File"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-20 ">
                {/* 2. MAIN CARD - The Central Surface */}
                <Card className="border-none shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden bg-white w-full py-0">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* LEFT: THE COVER (Fixed Aspect) */}
                        <div className="md:col-span-4 lg:col-span-3 bg-slate-100 p-8 flex items-center justify-center border-r border-slate-100">
                            <div className="relative w-full aspect-2/3 shadow-2xl rounded-lg overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                                {book?.cover_url ? (
                                    <Image
                                        src={book.cover_url}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-400">
                                        <BookOpen size={48} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: CONTENT SECTION */}
                        <div className="md:col-span-8 lg:col-span-9 p-8 lg:p-12 space-y-8">
                            {/* Header Info */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {book?.categories?.map((cat: any) => (
                                        <Badge
                                            key={cat.id}
                                            variant="secondary"
                                            className="bg-indigo-50 text-indigo-600 border-none font-bold uppercase tracking-wider text-[10px] px-3"
                                        >
                                            {cat.name}
                                        </Badge>
                                    ))}
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    {book?.title}
                                </h1>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-white">
                                        <User size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 leading-none">
                                            Penulis
                                        </p>
                                        <p className="text-slate-900 font-semibold">
                                            {book?.authors
                                                ?.map((a: any) => `${a.first_name} ${a.last_name}`)
                                                .join(", ")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* Metadata Grid - Clean Boxes */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetaBox
                                    label="ISBN"
                                    value={book?.isbn}
                                    icon={<Hash className="h-4 w-4" />}
                                />
                                <MetaBox
                                    label="Tahun"
                                    value={book?.publish_year}
                                    icon={<Calendar className="h-4 w-4" />}
                                />
                                <MetaBox
                                    label="Bahasa"
                                    value={book?.language}
                                    icon={<Globe className="h-4 w-4" />}
                                />
                                <MetaBox
                                    label="Halaman"
                                    value={`${book?.pages || 0} hlm`}
                                    icon={<FileText className="h-4 w-4" />}
                                />
                            </div>

                            {/* Description Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                    <BookMarked className="h-4 w-4 text-indigo-500" /> Sinopsis
                                </h3>
                                <div className="text-slate-600 leading-relaxed text-sm shadow bg-slate-100 rounded-lg p-4 whitespace-pre-wrap max-w-4xl italic font-light">
                                    {book?.description || "Tidak ada sinopsis tersedia."}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3. ASSETS SECTION - Integrated below main card */}
                <div className="grid grid-cols-1 gap-6 w-full lg:w-[40%]">
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold text-slate-900">Digital Assets</h2>
                        <p className="text-sm text-slate-500">
                            Manajemen file digital untuk buku ini.
                        </p>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {/* Upload Bar - High Integrated */}
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-400 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {isUploading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Upload className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        Tambahkan File Baru
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        PDF atau EPUB (Max 50MB)
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="rounded-xl shadow-lg shadow-indigo-100 relative overflow-hidden"
                                disabled={isUploading}
                            >
                                {isUploading ? "Mengunggah..." : "Pilih File"}
                                <input
                                    type="file"
                                    title="Choose a file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0]"
                                    accept=".pdf,.epub,application/pdf,application/epub+zip"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </Button>
                        </div>

                        {/* List Files - Clean Row Style */}
                        <div className="grid gap-3">
                            {book?.book_files?.map((file: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                                {file.file_name}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                                {file.file_type} • {file.file_size}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full text-indigo-600 hover:bg-indigo-50"
                                            onClick={() => router.push(`/reader/${file.id}`)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full text-rose-500 hover:bg-rose-50"
                                            onClick={() => {
                                                setSelectedFileId(file.id);
                                                setActionType("delete_file");
                                                setDialogOpen(true);
                                            }}
                                            disabled={isDeletingFile && selectedFileId === file.id}
                                        >
                                            {isDeletingFile && selectedFileId === file.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MetaBox({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) {
    return (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                    {label}
                </span>
            </div>
            <p className="text-sm font-bold text-slate-800">{value || "—"}</p>
        </div>
    );
}

function DetailLoading() {
    return (
        <div className="p-12 space-y-8 animate-pulse">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-125 w-full rounded-3xl" />
        </div>
    );
}
