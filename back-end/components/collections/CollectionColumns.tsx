"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../customui/Delete";
import Link from "next/link";

export const columns: ColumnDef<CollectionType>[] = [
    {
        accessorKey: "title",
        header: "Tên danh mục",
        cell: ({ row }) => (
            <Link href={`/collections/${row.original._id}`} className="hover:text-red-1">
                {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: "products",
        header: "Số lượng sản phẩm",
        cell: ({ row }) => <p>{row.original.products?.length ?? 0}</p>, // Sử dụng optional chaining và nullish coalescing
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="collections" id={row.original._id} />,
    },
];
