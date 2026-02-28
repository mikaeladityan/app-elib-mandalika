"use client";

import { useBookQuery, useBookTableState } from "@/app/(application)/books/server/use.book";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Search,
    Filter,
    Archive,
    Package,
    ArrowUpDown,
    Calendar,
    X,
    BookOpen,
    Building2,
    Hash,
    Globe,
    ImageIcon,
    Layers,
    Plus,
    ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { QueryBookDTO } from "@/app/(application)/books/server/book.schema";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export function Book() {
    const router = useRouter();
    const table = useBookTableState();
    const { data, total, isFetching, isLoading } = useBookQuery(table.queryParams);

    // Tetap pertahankan SEMUA filter dari kode awal
    const [localFilters, setLocalFilters] = useState({
        category_slug: table.filters.category_slug || "",
        author: table.filters.author || "",
        publisher: table.filters.publisher || "",
        publish_year: table.filters.publish_year?.toString() || "",
        language: table.filters.language || "",
        pages: table.filters.pages?.toString() || "",
        sortBy: table.sortBy as QueryBookDTO["sortBy"],
        sortOrder: table.sortOrder as QueryBookDTO["sortOrder"],
    });

    const activeFilterCount = Object.values(table.filters).filter(
        (val) => val !== undefined && val !== null && val !== "",
    ).length;

    const handleApplyFilter = () => {
        table.setFilter("category_slug", localFilters.category_slug || undefined);
        table.setFilter("author", localFilters.author || undefined);
        table.setFilter("publisher", localFilters.publisher || undefined);
        table.setFilter("publish_year", localFilters.publish_year || undefined);
        table.setFilter("language", localFilters.language || undefined);
        table.setFilter("pages", localFilters.pages || undefined);

        if (localFilters.sortBy !== table.sortBy || localFilters.sortOrder !== table.sortOrder) {
            table.onSort(localFilters.sortBy);
        }
    };

    const handleClearFilters = () => {
        const reset = {
            category_slug: "",
            author: "",
            publisher: "",
            publish_year: "",
            language: "",
            pages: "",
            sortBy: "updated_at" as const,
            sortOrder: "desc" as const,
        };
        setLocalFilters(reset);
        table.setFilter("category_slug", undefined);
        table.setFilter("author", undefined);
        table.setFilter("publisher", undefined);
        table.setFilter("publish_year", undefined);
        table.setFilter("language", undefined);
        table.setFilter("pages", undefined);
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen">
            {/* --- 1. Header Section (Clean Style) --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Katalog Perpustakaan
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Kelola dan tinjau koleksi{" "}
                        <span className="text-indigo-600 font-bold">{total ?? 0}</span> judul buku.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={table.toggleTrashMode}
                        className="rounded-lg border-slate-200 bg-white"
                    >
                        {table.isTrashMode ? (
                            <Package className="mr-2 h-4 w-4" />
                        ) : (
                            <Archive className="mr-2 h-4 w-4" />
                        )}
                        {table.isTrashMode ? "Daftar Aktif" : "Arsip Sampah"}
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => router.push("/books/create")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Buku Baru
                    </Button>
                </div>
            </div>

            {/* --- 2. Toolbar & Search --- */}
            <Card className="p-4 border-slate-200 shadow-sm rounded-xl">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari judul, penulis, atau ISBN..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                            className="pl-10 bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-indigo-500"
                        />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full md:w-auto rounded-lg border-slate-200 relative"
                            >
                                <Filter className="mr-2 h-4 w-4 text-slate-500" />
                                Filter Lanjut
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl rounded-2xl border-none shadow-xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">
                                    Filter Katalog
                                </DialogTitle>
                                <DialogDescription>
                                    Sesuaikan parameter pencarian secara mendalam.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">
                                            Pengurutan
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Select
                                                value={localFilters.sortBy}
                                                onValueChange={(val: any) =>
                                                    setLocalFilters((p) => ({ ...p, sortBy: val }))
                                                }
                                            >
                                                <SelectTrigger className="rounded-lg h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="updated_at">
                                                        Update
                                                    </SelectItem>
                                                    <SelectItem value="title">Judul</SelectItem>
                                                    <SelectItem value="publish_year">
                                                        Tahun
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select
                                                value={localFilters.sortOrder}
                                                onValueChange={(val: any) =>
                                                    setLocalFilters((p) => ({
                                                        ...p,
                                                        sortOrder: val,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="rounded-lg h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="desc">Desc</SelectItem>
                                                    <SelectItem value="asc">Asc</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">
                                            Kategori
                                        </Label>
                                        <Input
                                            placeholder="Slug kategori..."
                                            value={localFilters.category_slug}
                                            onChange={(e) =>
                                                setLocalFilters((p) => ({
                                                    ...p,
                                                    category_slug: e.target.value,
                                                }))
                                            }
                                            className="h-9 rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">
                                            Penulis
                                        </Label>
                                        <Input
                                            placeholder="Nama penulis..."
                                            value={localFilters.author}
                                            onChange={(e) =>
                                                setLocalFilters((p) => ({
                                                    ...p,
                                                    author: e.target.value,
                                                }))
                                            }
                                            className="h-9 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">
                                            Bahasa
                                        </Label>
                                        <Select
                                            value={localFilters.language}
                                            onValueChange={(val) =>
                                                setLocalFilters((p) => ({ ...p, language: val }))
                                            }
                                        >
                                            <SelectTrigger className="rounded-lg h-9">
                                                <SelectValue placeholder="Pilih..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="id">Indonesia</SelectItem>
                                                <SelectItem value="en">English</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">
                                            Tahun Terbit
                                        </Label>
                                        <Select
                                            value={localFilters.publish_year}
                                            onValueChange={(val) =>
                                                setLocalFilters((p) => ({
                                                    ...p,
                                                    publish_year: val,
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="rounded-lg h-9">
                                                <SelectValue placeholder="Pilih..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-50">
                                                {years.map((y) => (
                                                    <SelectItem key={y} value={y}>
                                                        {y}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">
                                            Penerbit
                                        </Label>
                                        <Input
                                            placeholder="Nama penerbit..."
                                            value={localFilters.publisher}
                                            onChange={(e) =>
                                                setLocalFilters((p) => ({
                                                    ...p,
                                                    publisher: e.target.value,
                                                }))
                                            }
                                            className="h-9 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="border-t pt-4">
                                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                                    Reset Semua
                                </Button>
                                <DialogClose asChild>
                                    <Button
                                        size="sm"
                                        onClick={handleApplyFilter}
                                        className="bg-indigo-600 text-white"
                                    >
                                        Terapkan Filter
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>

            {/* --- 3. Active Chips --- */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    {Object.entries(table.filters).map(
                        ([key, value]) =>
                            value && (
                                <Badge
                                    key={key}
                                    variant="secondary"
                                    className="rounded-md px-2 py-1 bg-white border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center gap-1"
                                >
                                    <span className="opacity-60">{key}:</span> {value}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                                        onClick={() => table.setFilter(key, undefined)}
                                    />
                                </Badge>
                            ),
                    )}
                </div>
            )}

            {/* --- 4. Content Grid (Responsive) --- */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[3/4.5] rounded-xl bg-slate-200 animate-pulse"
                        />
                    ))}
                </div>
            ) : data && data.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-8">
                    {data.map((book: any) => (
                        <div
                            key={book.id}
                            onClick={() => router.push(`/books/${book.id}`)}
                            className="group flex flex-col cursor-pointer transition-all duration-300"
                        >
                            {/* Poster / Cover */}
                            <div className="relative aspect-[3/4.5] w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all border border-slate-200">
                                {book.cover_url ? (
                                    <Image
                                        src={book.cover_url}
                                        alt={book.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                                        <ImageIcon size={40} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-bold text-[10px] shadow-sm">
                                        {book.publish_year}
                                    </Badge>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="mt-3 space-y-1">
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider truncate">
                                    {book.categories?.[0]?.name || "Uncategorized"}
                                </p>
                                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {book.title}
                                </h3>
                                <div className="flex items-center gap-2 pt-1">
                                    <p className="text-[11px] text-slate-500 font-medium truncate flex-1">
                                        {book.authors?.map((a: any) => a.first_name).join(", ") ||
                                            "No Author"}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                        <Globe className="h-3 w-3" /> {book.language?.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
                    <Layers className="h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Katalog Kosong</h3>
                    <p className="text-sm text-slate-500 mb-6 text-center max-w-70">
                        Tidak ada buku yang cocok dengan kriteria pencarian Anda.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="rounded-lg"
                    >
                        Reset Pencarian
                    </Button>
                </div>
            )}
        </div>
    );
}
