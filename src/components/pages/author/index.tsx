"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
    Package,
    Plus,
    Trash,
    Search,
    ChevronDown,
    Loader2,
    DatabaseBackup,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogDescription } from "@/components/ui/dialog";

import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/usage/table.skeleton";
import { AuthorColumns } from "./table/column";
import {
    useActionAuthor,
    useAuthorQuery,
    useAuthorTableState,
} from "@/app/(application)/authors/server/use.author";
import { BulkActionBar } from "@/components/ui/table/bulk-toolbar";
import { DialogAlert } from "@/components/ui/dialog/dialog.alert";
import { LogData } from "@/components/log";

export function Author() {
    const table = useAuthorTableState();
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        created_at: false,
        updated_at: true,
    });
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const selectedDataForBackend = useMemo(() => {
        return Object.keys(rowSelection)
            .filter((key) => rowSelection[key])
            .map((id) => ({ id: Number(id) }));
    }, [rowSelection]);
    const selectedCount = selectedDataForBackend.length;

    const { data, meta } = useAuthorQuery(table.queryParams);
    const { deleteMany, restoreMany, destroyMany, isDeleting, isRestoring, isDestroying } =
        useActionAuthor();

    useEffect(() => {
        setRowSelection({});
    }, [table.queryParams]);

    const columns = useMemo(
        () =>
            AuthorColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = meta.isLoading || meta.isFetching || meta.isRefetching;

    // Ambil ID yang dipilih
    const selectedIds = useMemo(() => {
        return Object.keys(rowSelection)
            .filter((key) => rowSelection[key])
            .map(Number);
    }, [rowSelection]);

    const handleBulkDelete = async () => {
        if (selectedCount === 0) return;

        await deleteMany(selectedDataForBackend);
        setRowSelection({});
    };

    const handleBulkRestore = async () => {
        if (selectedCount === 0) return;
        await restoreMany(selectedDataForBackend);
        setRowSelection({});
    };

    const handleBulkDestroy = async () => {
        if (selectedCount === 0) return;
        await destroyMany(selectedDataForBackend);
        setRowSelection({});
    };

    return (
        <>
            <header className="space-y-1 mb-5">
                <h2 className="text-xl tracking-wide font-black uppercase italic">
                    Kumpulan Penulis
                </h2>
                <p className="text-sm text-muted-foreground">
                    Kelola seluruh data penulis yang anda miliki
                </p>
            </header>

            {/* {isDeleting || isRestoring || isDestroying} */}

            <Card className="w-full lg:w-6/12">
                <CardHeader className="space-y-4">
                    <InputGroup className="w-full md:max-w-sm">
                        <InputGroupInput
                            placeholder="Cari penulis..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {meta.isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {meta.data?.len ?? 0} hasil
                                </span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>

                    {/* Tombol aksi utama */}
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div className="flex gap-2">
                            <Link href="/authors/create">
                                <Button>
                                    <Plus className="h-4 w-4" />
                                    Penulis
                                </Button>
                            </Link>

                            <Button
                                variant={table.isTrashMode ? "outline" : "rose"}
                                onClick={table.toggleTrashMode}
                            >
                                {table.isTrashMode ? (
                                    <>
                                        <Package className="h-4 w-4" />
                                        Daftar Penulis
                                    </>
                                ) : (
                                    <>
                                        <Trash className="h-4 w-4" />
                                        Sampah
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Kolom
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {Object.entries(columnVisibility).map(([key, value]) => (
                                        <DropdownMenuCheckboxItem
                                            key={key}
                                            checked={value}
                                            onCheckedChange={(checked) =>
                                                setColumnVisibility((prev) => ({
                                                    ...prev,
                                                    [key]: Boolean(checked),
                                                }))
                                            }
                                        >
                                            {key.replace("_", " ").toUpperCase()}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {selectedCount > 0 && (
                        <BulkActionBar
                            selectedCount={selectedCount}
                            onClearSelection={() => setRowSelection({})}
                        >
                            {table.isTrashMode ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleBulkRestore}
                                        disabled={isRestoring}
                                    >
                                        <DatabaseBackup className="mr-1 h-4 w-4" />
                                        Restore
                                    </Button>
                                    <DialogAlert
                                        title="Hapus Permanen"
                                        onClick={handleBulkDestroy}
                                        label="Hapus Permanen"
                                        className="py-1 font-bold text-sm rounded-md bg-red-500 text-red-50 hover:bg-red-400"
                                    >
                                        <DialogDescription>
                                            Apakah anda yakin ingin menghapus permanen{" "}
                                            {selectedCount} item? Tindakan ini tidak dapat
                                            dibatalkan.
                                        </DialogDescription>
                                    </DialogAlert>
                                </>
                            ) : (
                                <DialogAlert
                                    title="Hapus"
                                    className="py-1 font-bold text-sm rounded-md bg-red-500 text-red-50 hover:bg-red-400"
                                    onClick={handleBulkDelete}
                                    label={
                                        <>
                                            <Trash2 className="size-4.5" strokeWidth={2.5} />
                                            Hapus
                                        </>
                                    }
                                >
                                    <DialogDescription>
                                        Apakah anda yakin ingin menghapus {selectedIds.length} item?
                                    </DialogDescription>
                                </DialogAlert>
                            )}
                        </BulkActionBar>
                    )}
                </CardHeader>

                {/* Tabel */}
                {isTableLoading ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={data}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 10}
                            total={meta?.data?.len ?? 0}
                            onPageChange={(page) => table.setPage(page)}
                            onPageSizeChange={(size) => table.setPageSize(size)}
                            state={{ columnVisibility }}
                            onColumnVisibilityChange={setColumnVisibility}
                            enableRowSelection={true}
                            rowSelection={rowSelection}
                            onRowSelectionChange={setRowSelection}
                            getRowId={(row) => String(row.id)}
                        />
                    </CardContent>
                )}
            </Card>

            <LogData data={rowSelection} />
        </>
    );
}
