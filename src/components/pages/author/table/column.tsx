"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ParseDate } from "@/lib/utils";
import { ResponseAuthorDTO } from "@/app/(application)/authors/server/author.schema";

type AuthorColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export const AuthorColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: AuthorColumnsProps): ColumnDef<ResponseAuthorDTO>[] => [
    {
        id: "first_name",
        accessorKey: "first_name",
        enableHiding: false, //
        header: () => (
            <SortableHeader
                label="Nama Lengkap"
                sortKey="first_name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <>
                <Link href={`/authors/${row.original.id}`}>
                    <h2 className="font-medium underline">
                        {row.original.first_name} {row.original.last_name}
                    </h2>
                </Link>
            </>
        ),
    },
    {
        id: "created_at",
        accessorKey: "created_at",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="Pembuatan"
                sortKey="created_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => <>{ParseDate(row.original.created_at)} WIB</>,
    },
    {
        id: "updated_at",
        accessorKey: "updated_at",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="Update"
                sortKey="updated_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => <>{ParseDate(row.original.updated_at)} WIB</>,
    },
];
