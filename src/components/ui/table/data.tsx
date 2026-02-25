"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    OnChangeFn,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowRightLeft,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;

    state?: { columnVisibility?: VisibilityState };
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

    enableRowSelection?: boolean;
    rowSelection?: Record<string, boolean>;
    onRowSelectionChange?: OnChangeFn<Record<string, boolean>>;
    getRowId?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    state,
    onColumnVisibilityChange,
    enableRowSelection = false,
    rowSelection,
    onRowSelectionChange,
    getRowId,
}: DataTableProps<TData, TValue>) {
    const ref = useRef<HTMLDivElement>(null);
    const [overflow, setOverflow] = useState(false);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const selectionColumn: ColumnDef<TData, unknown> = {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                aria-label="Pilih semua"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Pilih baris"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 5,
    };

    const tableColumns = useMemo(() => {
        if (enableRowSelection) {
            return [selectionColumn, ...columns];
        }
        return columns;
    }, [enableRowSelection, columns]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        manualPagination: true,
        pageCount: totalPages,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize,
            },
            columnVisibility: state?.columnVisibility,
            rowSelection: rowSelection,
        },
        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function" ? updater(table.getState().pagination) : updater;
            if (next.pageIndex !== page - 1) onPageChange(next.pageIndex + 1);
            if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
        },
        onColumnVisibilityChange,
        onRowSelectionChange: onRowSelectionChange,
        getRowId: getRowId,
        enableRowSelection: enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (!ref.current) return;
        const { scrollWidth, clientWidth } = ref.current;
        setOverflow(scrollWidth > clientWidth);
    }, [data, columns, state?.columnVisibility]);

    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="space-y-4">
            {overflow && (
                <div className="md:hidden text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                    <ArrowRightLeft className="h-3 w-3 animate-pulse" />
                    Geser tabel ke samping untuk melihat lebih banyak kolom
                </div>
            )}

            <div ref={ref} className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap bg-muted/50"
                                        style={{ width: header.column.getSize() }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="whitespace-nowrap">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllLeafColumns().length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada data ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-muted-foreground">
                    Menampilkan {startItem} - {endItem} dari {total} data
                </div>

                <div className="flex flex-col xl:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Baris per halaman:</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 25, 50, 100, 250, 500, 1000].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm">
                            Halaman {page} dari {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(totalPages)}
                            disabled={page >= totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
