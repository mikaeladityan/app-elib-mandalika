import { useQuery } from "@tanstack/react-query";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useRouter } from "next/navigation";
import { BookService } from "./book.service";
import { QueryBookDTO, RequestBookDTO } from "./book.schema";

export function useBook(params?: QueryBookDTO, id?: string) {
    const list = useQuery({
        queryKey: ["books", params],
        queryFn: () => BookService.list(params!),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["books", id],
        queryFn: () => BookService.detail(String(id)),
        enabled: !!id && !params,
    });

    return { list, detail };
}

export function useBookTableState() {
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
                page: "1",
            });
        },
        [sortBy, sortOrder],
    );

    const status = (get("status") as QueryBookDTO["status"]) ?? "active";
    const isTrashMode = status === "delete";

    const toggleTrashMode = () => {
        batchSet({
            status: isTrashMode ? "active" : "delete",
            page: "1",
        });
    };

    const setFilter = (key: string, value?: string) => {
        batchSet({
            [key]: value || undefined,
            page: "1",
        });
    };

    const filters = {
        category_slug: get("category_slug") ?? undefined,
        author: get("author") ?? undefined,
        publisher: get("publisher") ?? undefined,
        publish_year: get("publish_year") ? Number(get("publish_year")) : undefined,
        language: get("language") ?? undefined,
        pages: get("pages") ? Number(get("pages")) : undefined,
    };

    const setPage = (page: number) => batchSet({ page: String(page) });

    const setPageSize = (take: number) =>
        batchSet({
            take: String(take),
            page: "1",
        });

    const queryParams = useMemo<QueryBookDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 10),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryBookDTO["sortBy"],
            sortOrder,
            status,
            ...filters,
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

        filters,
        setFilter,

        queryParams,
        setPage,
        setPageSize,
    };
}

export function useBookQuery(params: QueryBookDTO) {
    const query = useBook(params);

    return {
        data: query.list.data?.data ?? [],
        total: query.list.data?.len ?? 0,
        isLoading: query.list.isLoading,
        isFetching: query.list.isFetching,
        ...query,
    };
}

export function useBookOptions() {
    return useQuery({
        queryKey: ["books", "options"],
        queryFn: BookService.getOptions,
    });
}

function extractIds(items: Array<string | number | { id: string | number }>): string[] {
    return items.map((i) => (typeof i === "object" ? String(i.id) : String(i)));
}
export function useActionBook() {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);

    const deleteMutation = useMutation({
        mutationFn: async (items: Array<string | number | { id: string | number }>) => {
            const ids = extractIds(items);
            await Promise.all(ids.map((id) => BookService.softDelete(id)));
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    const restoreMutation = useMutation({
        mutationFn: async (items: Array<string | number | { id: string | number }>) => {
            const ids = extractIds(items);
            await Promise.all(ids.map((id) => BookService.restore(id)));
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },

        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    const destroyMutation = useMutation({
        mutationFn: async (items: Array<string | number | { id: string | number }>) => {
            const ids = extractIds(items);
            await Promise.all(ids.map((id) => BookService.destroy(id)));
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
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

export function useFormBook(id?: string) {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const router = useRouter();
    const create = useMutation<
        { title: string; id: string },
        ResponseError,
        { body: RequestBookDTO; cover: File | null }
    >({
        mutationKey: ["book", "create"],
        mutationFn: ({ body, cover }) => BookService.create(body, cover),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["books"], type: "all" });
            setNotif({
                title: `Data Buku ${data.title}`,
                message: `Data buku ${data.title} berhasil disimpan.`,
            });
            router.push(`/books/${data.id}`);
        },
    });

    const update = useMutation<
        { title: string; id: string },
        ResponseError,
        { body: Partial<RequestBookDTO>; cover: File | null }
    >({
        mutationKey: ["book", "update", id],
        mutationFn: ({ body, cover }) => BookService.update(String(id), body, cover),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["books"], type: "all" });
            setNotif({
                title: `Data Buku ${data.title}`,
                message: `Data buku ${data.title} berhasil diperbarui`,
            });
            router.push(`/books/${data.id}`);
        },
    });

    return {
        create: create.mutateAsync,
        update: update.mutateAsync,
        isPending: create.isPending || update.isPending,
    };
}

export function useActionBookFile(id: string) {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const uploadFile = useMutation({
        mutationFn: (file: File) => BookService.addBookFile(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books", id] });
            setNotif({
                title: "Berhasil",
                message: "Aset digital berhasil ditambahkan",
            });
        },
        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    const deleteFile = useMutation({
        mutationFn: (fileId: string) => BookService.deleteBookFile(id, fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books", id] });
            setNotif({
                title: "Berhasil",
                message: "Aset digital berhasil dihapus",
            });
        },
        onError: (err: ResponseError) => FetchError(err, setErr),
    });

    return {
        uploadFile: uploadFile.mutateAsync,
        isUploading: uploadFile.isPending,
        deleteFile: deleteFile.mutateAsync,
        isDeletingFile: deleteFile.isPending,
    };
}
