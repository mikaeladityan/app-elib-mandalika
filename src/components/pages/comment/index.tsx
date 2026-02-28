"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    MessageCircle,
    Archive,
    Package,
    Trash2,
    Loader2,
    CalendarClock,
    Link as LinkIcon,
} from "lucide-react";
import {
    useGlobalComments,
    useGlobalCommentTableState,
    useActionGlobalComment,
} from "@/app/(application)/comments/server/use.comment";
// @ts-ignore
import { format as formatTimeAgo } from "timeago.js";
import { useRouter } from "next/navigation";

export function Comment() {
    const table = useGlobalCommentTableState();
    const { list } = useGlobalComments(table.tableParams);
    const { destroyComment, isDestroying } = useActionGlobalComment();
    const router = useRouter();

    const data = list.data?.data ?? [];
    const total = list.data?.len ?? 0;
    const isLoading = list.isLoading;

    const handleDelete = async (id: string) => {
        if (confirm("Ingin menghapus komentar ini dari database?")) {
            await destroyComment(id);
        }
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Manajemen Komentar
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Pantau diskusi dan balas balik. Total{" "}
                        <span className="text-slate-900 font-bold">{total}</span> jejak komentar.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={table.toggleTrashMode}
                        className="rounded-lg border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700"
                    >
                        {table.status === "delete" ? (
                            <Package className="mr-2 h-4 w-4" />
                        ) : (
                            <Archive className="mr-2 h-4 w-4 text-slate-400" />
                        )}
                        {table.status === "delete" ? "Mode Normal" : "Kotak Sampah"}
                    </Button>
                </div>
            </div>

            {/* 2. Toolbar & Search */}
            <Card className="p-4 border-slate-200 shadow-sm rounded-xl">
                <div className="flex items-center">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari berdasarkan nama user atau isi komentar..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                            className="pl-10 bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-slate-900"
                        />
                    </div>
                </div>
            </Card>

            {/* 3. Global Comments List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-40 rounded-2xl bg-slate-200 animate-pulse w-full"
                        />
                    ))}
                </div>
            ) : data && data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((item: any) => (
                        <Card
                            key={item.id}
                            className="p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border font-bold text-slate-500">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center text-[10px] text-slate-400 font-semibold gap-1">
                                                <CalendarClock className="w-3 h-3" />
                                                {formatTimeAgo(item.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            item.status === "DELETE"
                                                ? "text-rose-500 border-rose-200 bg-rose-50"
                                                : "text-emerald-500 border-emerald-200 bg-emerald-50"
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </div>

                                <p className="text-sm text-slate-600 line-clamp-3">
                                    {item.content}
                                </p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-xs text-slate-700 hover:text-black font-semibold gap-1"
                                    onClick={() => router.push(`/posts/${item.post_id}`)}
                                >
                                    <LinkIcon className="w-3 h-3" />
                                    Lihat di Post
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={isDestroying}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Hapus
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl max-w-4xl mx-auto w-full shadow-sm">
                    <MessageCircle className="h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Belum Ada Komentar</h3>
                    <p className="text-sm text-slate-500 text-center max-w-70">
                        Silakan buat status menarik agar banyak audiens berinteraksi.
                    </p>
                </div>
            )}
        </div>
    );
}
