"use client";

import { useAuthor } from "@/app/(application)/authors/server/use.author";
import { useParams, useRouter } from "next/navigation";
import {
    Book,
    Calendar,
    User,
    ArrowLeft,
    Clock,
    Globe,
    Hash,
    Layers,
    Building2,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function DetailAuthor() {
    const { id } = useParams();
    const router = useRouter();
    const { detail } = useAuthor(undefined, Number(id));

    if (detail.isLoading) return <DetailSkeleton />;
    if (!detail.data)
        return (
            <div className="p-10 text-center uppercase font-black italic tracking-wider">
                Data penulis tidak ditemukan.
            </div>
        );

    const author = detail.data;

    return (
        <div className="space-y-8 pb-10 w-full lg:w-9/12">
            {/* Header & Back Button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/authors")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl uppercase font-black italic tracking-wider">
                        Detail Penulis
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Informasi lengkap mengenai profil dan karya penulis.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Profil & Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="h-32 bg-linear-to-r from-blue-200 to-teal-300" />
                        <CardContent className="relative pt-12">
                            <div className="absolute -top-12 left-6">
                                <div className="h-24 w-24 rounded-xl bg-white p-1 shadow-xl">
                                    <div className="h-full w-full rounded-lg bg-muted flex items-center justify-center">
                                        <User className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold">
                                    {author.first_name} {author.last_name}
                                </h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Bergabung pada{" "}
                                    {new Date(author.created_at).toLocaleDateString("id-ID", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold mb-2">Biografi</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {author.bio ||
                                            "Penulis belum menambahkan biografi singkat."}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Total Karya</span>
                                        <span className="font-medium">
                                            {author.books?.length || 0} Buku
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">ID Penulis</span>
                                        <Badge variant="secondary">#{author.id}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Daftar Buku */}
                <Link href={""} className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl flex items-center gap-2 uppercase font-black italic tracking-wider">
                            <Book className="h-5 w-5 text-blue-600" />
                            Daftar Buku Terbit
                        </h3>
                        <Badge variant="outline">{author.books?.length || 0} Koleksi</Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {author.books && author.books.length > 0 ? (
                            author.books.map((book: any, index: number) => (
                                <Card
                                    key={index}
                                    className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Info Utama Buku */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h4 className="uppercase italic text-gray-500 font-black tracking-wide group-hover:text-emerald-900 transition-colors">
                                                            {book.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge
                                                                variant={
                                                                    book.status === "ACTIVE"
                                                                        ? "destructive"
                                                                        : "secondary"
                                                                }
                                                                className="text-[10px] px-2 py-0"
                                                            >
                                                                {book.status}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Building2 className="h-3 w-3" />
                                                                {book.publisher?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {book.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {book.categories?.map((cat: any) => (
                                                        <Badge
                                                            key={cat.slug}
                                                            variant="outline"
                                                            className="bg-muted/30 font-normal"
                                                        >
                                                            {cat.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Meta Data Buku */}
                                            <div className="md:w-48 grid grid-cols-2 md:flex md:flex-col gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-dashed">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span>{book.publish_year}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span>{book.pages} Halaman</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="uppercase">
                                                        {book.language}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="truncate">
                                                        {book.isbn || "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl border-2 border-dashed">
                                <Layers className="h-10 w-10 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    Belum ada buku yang terdaftar untuk penulis ini.
                                </p>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="w-full lg:w-9/12 space-y-8">
            <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-100 w-full" />
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-37.5 w-full" />
                    <Skeleton className="h-37.5 w-full" />
                </div>
            </div>
        </div>
    );
}
