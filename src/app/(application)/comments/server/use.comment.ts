import { useQuery } from "@tanstack/react-query";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { CommentGlobalService } from "./comment.service";
import { QueryCommentDTO } from "@/app/(application)/posts/server/post.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError } from "@/lib/utils/error";

export function useGlobalComments(params: QueryCommentDTO) {
    const list = useQuery({
        queryKey: ["global-comments", params],
        queryFn: () => CommentGlobalService.list(params),
    });

    return { list };
}

export function useGlobalCommentTableState() {
    const { get, batchSet } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    const page = parseInt(get("page") ?? "1");
    const take = parseInt(get("take") ?? "10");
    const status = (get("status") as "active" | "delete") ?? "active";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const tableParams: QueryCommentDTO = {
        page,
        take,
        sortOrder,
        search: get("search") ?? undefined,
        // Optional status addition if API supports it in the query dto (which I added internally)
    };

    return {
        tableParams,
        search,
        setSearch,
        status,
        toggleTrashMode: () =>
            batchSet({ status: status === "delete" ? "active" : "delete", page: "1" }),
    };
}

export function useActionGlobalComment() {
    const queryClient = useQueryClient();
    const saveNotif = useSetAtom(notificationAtom);
    const saveError = useSetAtom(errorAtom);

    // Using the same endpoint as detail view since they just take the commentId
    const { deleteComment } = require("@/app/(application)/posts/server/post.service").PostService;

    const destroyComment = useMutation({
        mutationFn: async (commentId: string) => {
            return await deleteComment(commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["global-comments"] });
            // Invalidate post comments as well
            queryClient.invalidateQueries({ queryKey: ["comments"] });
            saveNotif({
                title: "Berhasil!",
                message: "Komentar telah dihapus",
            });
        },
        onError: (err: any) => FetchError(err, saveError),
    });

    return {
        destroyComment: destroyComment.mutateAsync,
        isDestroying: destroyComment.isPending,
    };
}
