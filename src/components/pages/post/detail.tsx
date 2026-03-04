"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Edit3,
    Trash2,
    MessageCircle,
    Loader2,
    Send,
    Reply,
    UserCircle2,
    CalendarClock,
    RefreshCcw,
} from "lucide-react";
import {
    usePost,
    useActionPost,
    usePostComments,
    useActionComment,
} from "@/app/(application)/posts/server/use.post";
// @ts-ignore
import { format as formatTimeAgo } from "timeago.js";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useAuthAccount } from "@/app/auth/server/use.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const CommentFormSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
    content: z
        .string()
        .min(1, "Komentar tidak boleh kosong")
        .max(200, "Komentar maksimal 200 karakter"),
});

export function DetailPost() {
    const { id } = useParams();
    const router = useRouter();

    // 1. Post Fetching
    const { detail } = usePost(undefined, String(id));
    const post = detail.data;
    const {
        softDelete,
        isDeleting,
        restore,
        isRestoring,
        destroy,
        isDestroying: isDestroyingPost,
    } = useActionPost();

    // 2. Comments Fetching
    const [commentTake, setCommentTake] = useState(10);
    const { list: commentsList } = usePostComments(String(id), {
        page: 1,
        take: commentTake,
        sortOrder: "asc",
    } as any);
    const commentsCount = commentsList.data?.len || 0;
    const comments = commentsList.data?.data || [];

    // 3. Actions
    const { publishComment, isPublishing, destroyComment, isDestroying } = useActionComment(
        String(id),
    );

    // Form states
    const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
    const [isDestroyDialogOpen, setIsDestroyDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const form = useForm<z.infer<typeof CommentFormSchema>>({
        resolver: zodResolver(CommentFormSchema),
        defaultValues: { name: "", content: "" },
    });

    const currentCommentContent = form.watch("content");

    const { data: authData } = useAuthAccount();

    React.useEffect(() => {
        if (authData) {
            const firstName = authData.user?.first_name || "";
            const lastName = authData.user?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim();
            const displayName = fullName || authData.email;

            if (displayName && !form.getValues("name")) {
                form.setValue("name", displayName);
            }
        }
    }, [authData, form]);

    const onSubmitComment = async (values: z.infer<typeof CommentFormSchema>) => {
        try {
            await publishComment({
                name: values.name,
                content: values.content,
                parent_id: replyingTo ? replyingTo.id : null,
            } as any);
            form.reset({ content: "", name: form.getValues("name") }); // Keep name for next comment
            setReplyingTo(null);
        } catch (error) {
            console.error(error);
        }
    };

    if (detail.isLoading) return <DetailLoading />;
    if (!post)
        return (
            <div className="text-center p-20 font-bold text-slate-500">Post tidak ditemukan</div>
        );

    const handleConfirmDeletePost = async () => {
        setIsDeleteDialogOpen(false);
        await softDelete(String(id));
        router.push("/posts");
    };

    const handleConfirmRestorePost = async () => {
        setIsRestoreDialogOpen(false);
        await restore(String(id));
    };

    const handleConfirmDestroyPost = async () => {
        setIsDestroyDialogOpen(false);
        await destroy(String(id));
        router.push("/posts");
    };

    const handleConfirmDeleteComment = async () => {
        if (commentToDelete) {
            await destroyComment(commentToDelete);
            setCommentToDelete(null);
        }
    };

    return (
        <div className="w-full space-y-6 pb-20">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/posts")}
                    className="gap-2 px-0 hover:bg-transparent text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-medium">Kembali ke Beranda</span>
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/posts/${id}/edit`)}
                        className="rounded-lg shadow-sm"
                    >
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Button>

                    {post.status === "DELETE" ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsRestoreDialogOpen(true)}
                                disabled={isRestoring}
                                className="rounded-lg shadow-sm text-slate-900 border-slate-200 hover:bg-slate-50"
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" /> Pulihkan
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsDestroyDialogOpen(true)}
                                disabled={isDestroyingPost}
                                className="rounded-lg shadow-sm bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            disabled={isDeleting}
                            className="rounded-lg shadow-sm"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </Button>
                    )}
                </div>
            </div>

            {/* The Main Post Card */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white px-8 py-10 md:px-12 md:py-14 space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-inner border-[3px] border-white ring-2 ring-slate-100">
                        P
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Admin Mandalika</h2>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mt-1">
                            <CalendarClock className="w-3.5 h-3.5" />
                            {formatTimeAgo(post.created_at)}
                            <Badge
                                variant="secondary"
                                className="bg-slate-100 text-slate-600 ml-2 rounded-[4px] px-1.5 py-0 text-[10px]"
                            >
                                {post.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div
                    className="text-slate-800 text-base md:text-lg leading-relaxed font-medium min-h-[100px] whitespace-pre-wrap wrap-break-word [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-blue-600 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-slate-100 [&_pre]:p-4 [&_pre]:rounded-md"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </Card>

            {/* Comments Section */}
            <div className="pt-8">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 mb-6">
                    <MessageCircle className="w-6 h-6 text-slate-900" />
                    Komentar Publik ({commentsList.data?.len || 0})
                </h3>

                {/* Recursive Comment Threading Builder - Scrollable */}
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
                    {commentsList.isLoading && comments.length === 0 ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <Skeleton className="h-24 w-10/12 rounded-2xl ml-auto" />
                        </div>
                    ) : comments.length > 0 ? (
                        <>
                            {comments.map((comment: any) => (
                                <CommentThread
                                    key={comment.id}
                                    comment={comment}
                                    onReply={(id, name) => {
                                        setReplyingTo({ id, name });
                                        window.scrollTo({
                                            top: document.body.scrollHeight,
                                            behavior: "smooth",
                                        }); // Scroll to bottom where form is
                                    }}
                                    onDelete={(id) => setCommentToDelete(id)}
                                    isDeleting={isDestroying}
                                />
                            ))}

                            {/* Load More Top-Level Comments Button */}
                            {commentsCount > commentTake && (
                                <div className="flex justify-center pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCommentTake((prev) => prev + 10)}
                                        className="rounded-xl border-dashed border-slate-300 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100"
                                    >
                                        Muat Lebih Banyak Komentar ({commentsCount - commentTake}{" "}
                                        tersisa)
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            Belum ada komentar sama sekali. Jadilah yang pertama!
                        </div>
                    )}
                </div>

                {/* Comment Form Box (Now at the bottom) */}
                <Card className="p-6 md:p-8 rounded-2xl border-slate-200 shadow-sm bg-white relative overflow-hidden">
                    {/* Replying indicator */}
                    {replyingTo && (
                        <div className="absolute top-0 left-0 w-full bg-slate-100 px-8 py-2 border-b border-slate-200 flex justify-between items-center z-10 transition-all">
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                <Reply className="w-3 h-3 text-slate-900" /> Membalas ke{" "}
                                <span className="text-slate-900 font-bold">@{replyingTo.name}</span>
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-rose-500 hover:bg-rose-50"
                                onClick={() => setReplyingTo(null)}
                            >
                                Batal Balas
                            </Button>
                        </div>
                    )}

                    <form
                        onSubmit={form.handleSubmit(onSubmitComment)}
                        className={`space-y-4 ${replyingTo ? "mt-8" : ""}`}
                    >
                        <div className="flex gap-4 items-start">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <UserCircle2 className="text-slate-400 w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <Input
                                    placeholder="Nama Anda (Publik)..."
                                    className="h-10 border-none bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-xl"
                                    {...form.register("name")}
                                />
                                {form.formState.errors.name && (
                                    <span className="text-[10px] text-rose-500 px-2">
                                        {form.formState.errors.name.message}
                                    </span>
                                )}

                                <div className="space-y-1">
                                    <Textarea
                                        placeholder="Tuliskan pendapat atau balasan Anda..."
                                        className="min-h-[100px] border-none bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-2xl resize-y p-4 text-sm"
                                        maxLength={200}
                                        {...form.register("content")}
                                    />
                                    <div className="flex justify-between items-start px-2">
                                        {form.formState.errors.content ? (
                                            <span className="text-[10px] text-rose-500">
                                                {form.formState.errors.content.message}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <span
                                            className={`text-[10px] font-semibold shrink-0 ${
                                                currentCommentContent?.length > 180
                                                    ? "text-orange-500"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {currentCommentContent?.length || 0} / 200
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isPublishing}
                                        className="bg-slate-900 hover:bg-black text-white rounded-xl px-6 font-bold shadow-md shadow-slate-200 transition-all active:scale-95"
                                    >
                                        {isPublishing ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4 mr-2" />
                                        )}
                                        Kirim Komentar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Delete Post Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pindahkan Status ke Kotak Sampah?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan memindahkan status beserta semua komentar di dalamnya
                            ke dalam kotak sampah. Anda yakin ingin melanjutkan?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDeletePost}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Pindah ke Sampah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Post Dialog */}
            <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pulihkan Status Ini?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan mengembalikan status ke beranda publik sehingga dapat
                            dilihat dan dikomentari kembali.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            className="bg-slate-900 hover:bg-black text-white"
                            onClick={handleConfirmRestorePost}
                            disabled={isRestoring}
                        >
                            {isRestoring && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Pulihkan Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Destroy Post Dialog */}
            <Dialog open={isDestroyDialogOpen} onOpenChange={setIsDestroyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Status Secara Permanen?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Seluruh data
                            status beserta jumlah komentar di dalamnya akan dimusnahkan selamanya
                            dari database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDestroyDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleConfirmDestroyPost}
                            disabled={isDestroyingPost}
                        >
                            {isDestroyingPost && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Hapus Permanen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Comment Dialog */}
            <Dialog
                open={!!commentToDelete}
                onOpenChange={(open) => !open && setCommentToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan / Hapus Komentar</DialogTitle>
                        <DialogDescription>
                            Komentar ini akan disembunyikan dan ditandai sebagai "Telah Dihapus"
                            oleh moderator. Tindakan ini tidak menghapus pesan asli secara permanen
                            dari database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCommentToDelete(null)}>
                            Kembali
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDeleteComment}
                            disabled={isDestroying}
                        >
                            {isDestroying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Hapus Komentar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Sub Component to handle recursive recursive replies tree
function CommentThread({
    comment,
    onReply,
    onDelete,
    isDeleting,
    depth = 0,
    parentName,
}: {
    comment: any;
    onReply: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
    depth?: number;
    parentName?: string;
}) {
    // Style indentation based on depth. Only indent at depth 1.
    // Deeper replies will align with depth 1 but mention the parent name.
    const isFirstLevelReply = depth === 1;
    const isDeepReply = depth > 1;

    // Frontend nested array chunking logic
    const [replyLimit, setReplyLimit] = useState(3);
    const hasMoreReplies = comment.replies && comment.replies.length > replyLimit;

    return (
        <div
            className={`flex flex-col gap-4 ${
                isFirstLevelReply
                    ? "ml-6 md:ml-12 mt-4 relative before:absolute before:-left-6 before:top-6 before:w-4 before:border-b-2 before:border-l-2 before:border-slate-200 before:h-8 before:-translate-y-8 before:rounded-bl-xl"
                    : isDeepReply
                      ? "mt-4"
                      : ""
            }`}
        >
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm z-10 relative">
                    <UserCircle2 className="text-slate-400 w-6 h-6" />
                </div>
                <div className="flex-1 bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm shadow-slate-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">{comment.name}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">
                                {formatTimeAgo(comment.created_at)}
                            </p>
                        </div>
                        {/* Soft deletion action for Admin */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-300 hover:text-rose-500"
                            onClick={() => onDelete(comment.id)}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>

                    {comment.status === "DELETE" ? (
                        <p className="text-sm text-slate-400 italic">
                            Komentar ini telah dihapus oleh moderator.
                        </p>
                    ) : (
                        <CommentText content={comment.content} parentName={parentName} />
                    )}

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => onReply(comment.id, comment.name)}
                            className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 transition-colors"
                        >
                            <Reply className="w-3 h-3" /> Balas{" "}
                            {isFirstLevelReply || isDeepReply ? "Komentar" : ""}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recursively Render Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col relative before:absolute before:left-[-1.15rem] md:before:left-[0.6rem] before:-top-8 before:bottom-6 before:border-l-2 before:border-slate-100 -mt-2">
                    {comment.replies.slice(0, replyLimit).map((reply: any) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            parentName={comment.name}
                            onReply={onReply}
                            onDelete={onDelete}
                            isDeleting={isDeleting}
                        />
                    ))}

                    {/* View More Replies Button */}
                    {hasMoreReplies && (
                        <div className={`mt-4 ${isFirstLevelReply ? "ml-6 md:ml-12" : ""}`}>
                            <button
                                onClick={() => setReplyLimit((prev) => prev + 5)}
                                className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
                            >
                                <div className="h-0.5 w-6 bg-slate-200"></div>
                                Tampilkan {comment.replies.length - replyLimit} balasan lainnya...
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DetailLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-10">
            <Skeleton className="h-8 w-40 rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
    );
}

function X(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function CommentText({ content, parentName }: { content: string; parentName?: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 150;

    const isLong = content?.length > maxLength;
    const displayText = isExpanded
        ? content
        : isLong
          ? content.slice(0, maxLength) + "..."
          : content;

    return (
        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed inline">
            {parentName && (
                <span className="text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-semibold mr-1.5">
                    @{parentName}
                </span>
            )}
            {displayText}
            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-slate-900 font-bold ml-1 text-xs hover:underline"
                >
                    {isExpanded ? "Sembunyikan" : "Lihat selengkapnya"}
                </button>
            )}
        </p>
    );
}
