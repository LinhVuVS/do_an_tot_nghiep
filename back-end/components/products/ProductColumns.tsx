"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../customui/Delete";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "title",
        header: "Tên sản phẩm",
        cell: ({ row }) => (
            <Link href={`/products/${row.original._id}`} className="hover:text-red-1">
                {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: "collections",
        header: "Loại sản phẩm",
        cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "),
    },
    {
        accessorKey: "price",
        header: "Giá (đ)",
    },
    {
        accessorKey: "quantity",
        header: "Số lượng",
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="product" id={row.original._id} />,
    },
];
