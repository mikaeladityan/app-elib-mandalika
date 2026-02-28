"use client";

import {
    usePost,
    usePostTableState,
    useActionPost,
} from "@/app/(application)/posts/server/use.post";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Loader2,
    Search,
    MessageSquareText,
    Archive,
    Package,
    Plus,
    Layers,
    Clock,
    BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
// @ts-ignore
import { format as formatTimeAgo } from "timeago.js";

export function Post() {
    const router = useRouter();
    const table = usePostTableState();
    const { list } = usePost(table.tableParams);

    // Safety destructure from react-query response
    const data = list.data?.data ?? [];
    const total = list.data?.len ?? 0;
    const isLoading = list.isLoading;

    return (
        <div className="flex flex-col gap-6 min-h-screen">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Status Publik
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Kirim pengumuman atau baca postingan.{" "}
                        <span className="text-slate-900 font-bold">{total}</span> kiriman tersedia.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={table.toggleTrashMode}
                        className="rounded-lg border-slate-200 bg-white shadow-sm"
                    >
                        {table.isTrashMode ? (
                            <Package className="mr-2 h-4 w-4" />
                        ) : (
                            <Archive className="mr-2 h-4 w-4 text-slate-400" />
                        )}
                        {table.isTrashMode ? "Mode Normal" : "Kotak Sampah"}
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => router.push("/posts/create")}
                        className="bg-slate-900 hover:bg-black text-white rounded-lg shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Buat Status
                    </Button>
                </div>
            </div>

            {/* 2. Toolbar & Search */}
            <Card className="p-4 border-slate-200 shadow-sm rounded-xl">
                <div className="flex items-center">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari konten postingan..."
                            value={table.search}
                            onChange={(e) => table.onSearchChange(e.target.value)}
                            className="pl-10 bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-indigo-500"
                        />
                    </div>
                </div>
            </Card>

            {/* 3. Content Feeds */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-40 rounded-xl bg-slate-200 animate-pulse w-full"
                        />
                    ))}
                </div>
            ) : data && data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {data.map((post: any) => (
                        <Card
                            key={post.id}
                            onClick={() => router.push(`/posts/${post.id}`)}
                            className="p-6 border border-slate-100 shadow-sm shadow-slate-100 hover:shadow-md transition-all rounded-2xl bg-white flex flex-col justify-between cursor-pointer group"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Top Bar Date */}
                                <div className="flex items-center justify-between pointer-events-none">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>{formatTimeAgo(post.created_at)}</span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="border-slate-200 bg-slate-50 text-slate-700 pointer-events-auto"
                                    >
                                        {post.status}
                                    </Badge>
                                </div>

                                {/* Content Body */}
                                <div
                                    className="text-slate-800 leading-relaxed text-sm font-medium line-clamp-4 overflow-hidden whitespace-pre-wrap break-words [&_p]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:ml-2"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                {/* Bottom Action */}
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold group-hover:text-slate-900 transition-colors">
                                        <MessageSquareText className="w-4 h-4" />
                                        <span>{post._count?.comments || 0} Balasan</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl max-w-4xl shadow-sm">
                    <Layers className="h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Belum Ada Status</h3>
                    <p className="text-sm text-slate-500 mb-6 text-center max-w-70">
                        Tidak ada tulisan atau status yang ditemukan di beranda.
                    </p>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push("/posts/create")}
                        className="rounded-lg bg-slate-900 hover:bg-black text-white"
                    >
                        Buat Postingan Pertama
                    </Button>
                </div>
            )}
        </div>
    );
}
