import { useQuery } from "@tanstack/react-query";
import { QueryAuthorDTO, RequestAuthorDTO } from "./author.schema";
import { AuthorService } from "./author.service";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useRouter } from "next/navigation";

export function useAuthor(params?: QueryAuthorDTO, id?: number) {
    const list = useQuery({
        queryKey: ["authors", params],
        queryFn: () => AuthorService.list(params!),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["authors", id],
        queryFn: () => AuthorService.detail(Number(id)),
        enabled: !!id && !params,
    });

    return { list, detail };
}

export function useAuthorTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // Search
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    // Sort
    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";

            batchSet({
                sortBy: key,
                sortOrder: nextOrder,
                page: "1",
            });
        },
        [sortBy, sortOrder],
    );

    // Trash
    const status = get("status") as QueryAuthorDTO["status"];
    const isTrashMode = status === "delete";

    const toggleTrashMode = () => {
        batchSet({
            status: isTrashMode ? undefined : "delete",
            page: "1",
        });
    };

    // Set Page
    const setPage = (page: number) => batchSet({ page: String(page) });

    const setPageSize = (take: number) =>
        batchSet({
            take: String(take),
            page: "1",
        });

    // Query DTO
    const queryParams = useMemo<QueryAuthorDTO>(
        () => ({
            take: Number(get("take") ?? 10),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryAuthorDTO["sortBy"],
            sortOrder,
            status,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        isTrashMode,
        toggleTrashMode,
        queryParams,
        setPage,
        setPageSize,
    };
}

export function useAuthorQuery(params: QueryAuthorDTO) {
    const query = useAuthor(params);

    return {
        data: query.list?.data?.data ?? [],
        meta: query.list,
        ...query,
    };
}

function extractIds(items: Array<number | { id: number }>): number[] {
    return items.map((i) => (typeof i === "number" ? i : i.id));
}
export function useActionAuthor() {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);

    const deleteMutation = useMutation({
        mutationFn: (items: Array<number | { id: number }>) =>
            AuthorService.deleteMany(extractIds(items)),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
        },
        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    const restoreMutation = useMutation({
        mutationFn: (items: Array<number | { id: number }>) =>
            AuthorService.restoreMany(extractIds(items)),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
        },

        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    const destroyMutation = useMutation({
        mutationFn: (items: Array<number | { id: number }>) =>
            AuthorService.destroyMany(extractIds(items)),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
        },
        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    return {
        deleteMany: deleteMutation.mutateAsync,
        restoreMany: restoreMutation.mutateAsync,
        destroyMany: destroyMutation.mutateAsync,

        isDeleting: deleteMutation.isPending,
        isRestoring: restoreMutation.isPending,
        isDestroying: destroyMutation.isPending,
    };
}

export function useFormAuthor(id?: number) {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const router = useRouter();
    const create = useMutation<unknown, ResponseError, RequestAuthorDTO>({
        mutationKey: ["author", "create"],
        mutationFn: (body) => AuthorService.create(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"], type: "all" });
            setNotif({
                title: "Data Penulis",
                message: "Data penulis berhasil disimpan.",
            });
            router.push("/authors");
        },
    });

    const update = useMutation<unknown, ResponseError, Partial<RequestAuthorDTO>>({
        mutationKey: ["author", "update", id],
        mutationFn: (body) => AuthorService.update(Number(id), body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"], type: "all" });
            setNotif({
                title: "Data Penulis",
                message: "Update penulis berhasil disimpan.",
            });
            router.push("/authors");
        },
    });

    return {
        create: create.mutateAsync,
        update: update.mutateAsync,
        isPending: create.isPending || update.isPending,
    };
}
