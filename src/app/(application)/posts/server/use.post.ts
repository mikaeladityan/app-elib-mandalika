import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useRouter } from "next/navigation";
import { PostService } from "./post.service";
import { QueryPostDTO, RequestPostDTO, QueryCommentDTO, RequestCommentDTO } from "./post.schema";

export function usePost(params?: QueryPostDTO, id?: string) {
    const list = useQuery({
        queryKey: ["posts", params],
        queryFn: () => PostService.list(params!),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["posts", id],
        queryFn: () => PostService.detail(String(id)),
        enabled: !!id && !params,
    });

    return { list, detail };
}

export function usePostTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";

            batchSet({
                sortBy: key,
                sortOrder: nextOrder,
            });
        },
        [batchSet, sortBy, sortOrder],
    );

    const onSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const page = parseInt(get("page") ?? "1");
    const take = parseInt(get("take") ?? "10");
    const status = (get("status") as "active" | "delete") ?? "active";

    const tableParams: QueryPostDTO = {
        page,
        take,
        sortOrder,
        sortBy: sortBy as "created_at" | "updated_at",
        search: get("search") ?? undefined,
        status,
    };

    const isTrashMode = status === "delete";
    const toggleTrashMode = () => {
        batchSet({
            status: isTrashMode ? "active" : "delete",
            page: "1",
        });
    };

    const onPageChange = useCallback(
        (newPage: number) => {
            batchSet({ page: newPage.toString() });
        },
        [batchSet],
    );

    const onTakeChange = useCallback(
        (newTake: string) => {
            batchSet({ take: newTake, page: "1" });
        },
        [batchSet],
    );

    return {
        tableParams,
        onSort,
        onSearchChange,
        search,
        isTrashMode,
        toggleTrashMode,
        onPageChange,
        onTakeChange,
        page,
        take,
    };
}

export function useActionPost(id?: string) {
    const queryClient = useQueryClient();
    const saveNotif = useSetAtom(notificationAtom);
    const saveError = useSetAtom(errorAtom);
    const router = useRouter();

    const push = useMutation({
        mutationKey: ["postPublish"],
        mutationFn: async (val: RequestPostDTO) => {
            return await PostService.create(val);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            saveNotif({
                title: "Status Diterbitkan!",
                message: "Status telah berhasil dipublikasikan.",
            });
            router.push("/posts");
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    const update = useMutation({
        mutationKey: ["postUpdate"],
        mutationFn: async (val: Partial<RequestPostDTO>) => {
            if (!id) throw new Error("ID Status diperlukan");
            return await PostService.update(id, val);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            saveNotif({
                title: "Status Diperbarui!",
                message: "Perubahan pada status telah disimpan.",
            });
            router.push("/posts");
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    const softDelete = useMutation({
        mutationFn: async (targetId: string) => {
            return await PostService.softDelete(targetId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            saveNotif({
                title: "Berhasil!",
                message: "Status dipindahkan ke kotak sampah",
            });
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    const restore = useMutation({
        mutationFn: async (targetId: string) => {
            return await PostService.restore(targetId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            saveNotif({
                title: "Berhasil!",
                message: "Status berhasil dipulihkan",
            });
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    const destroy = useMutation({
        mutationFn: async (targetId: string) => {
            return await PostService.destroy(targetId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            saveNotif({
                title: "Berhasil!",
                message: "Status dihancurkan selamanya",
            });
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    return {
        push: push.mutateAsync,
        isPushing: push.isPending,
        update: update.mutateAsync,
        isUpdating: update.isPending,
        softDelete: softDelete.mutateAsync,
        isDeleting: softDelete.isPending,
        restore: restore.mutateAsync,
        isRestoring: restore.isPending,
        destroy: destroy.mutateAsync,
        isDestroying: destroy.isPending,
    };
}

// ---------------- COMMENTS SECTION ---------------- //

export function usePostComments(postId: string, params?: QueryCommentDTO) {
    const list = useQuery({
        queryKey: ["comments", postId, params],
        queryFn: () => PostService.listComments(postId, params),
        enabled: !!postId,
    });

    return { list };
}

export function useActionComment(postId?: string) {
    const queryClient = useQueryClient();
    const saveNotif = useSetAtom(notificationAtom);
    const saveError = useSetAtom(errorAtom);

    const publishComment = useMutation({
        mutationFn: async (val: RequestCommentDTO) => {
            if (!postId) throw new Error("ID Post diperlukan");
            return await PostService.createComment(postId, val);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            saveNotif({
                title: "Berhasil!",
                message: "Komentar berhasil ditambahkan",
            });
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    const destroyComment = useMutation({
        mutationFn: async (commentId: string) => {
            return await PostService.deleteComment(commentId);
        },
        onSuccess: () => {
            // Also invalidate regardless of post ID if not provided closely
            queryClient.invalidateQueries({ queryKey: ["comments"] });
            saveNotif({
                title: "Berhasil!",
                message: "Komentar telah dihapus",
            });
        },
        onError: (err: ResponseError) => FetchError(err, saveError),
    });

    return {
        publishComment: publishComment.mutateAsync,
        isPublishing: publishComment.isPending,
        destroyComment: destroyComment.mutateAsync,
        isDestroying: destroyComment.isPending,
    };
}
