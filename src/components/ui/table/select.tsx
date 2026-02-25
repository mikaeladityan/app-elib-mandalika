import { ColumnDef } from "@tanstack/react-table";

export const SelectColumn = <T,>(): ColumnDef<T> => ({
    id: "select",

    header: ({ table }) => (
        <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
    ),

    cell: ({ row }) => (
        <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
        />
    ),

    enableSorting: false,
    enableHiding: false,
});
