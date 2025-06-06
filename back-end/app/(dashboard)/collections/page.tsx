"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/collections/CollectionColumns";
import { DataTable } from "@/components/customui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/customui/Loader";

const Collections = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);

    const getCollections = async () => {
        try {
            const res = await fetch("/api/collections", {
                method: "GET",
            });
            const data = await res.json();
            setCollections(data);
            setLoading(false);
        } catch (err) {
            console.log("[collections_GET]", err);
        }
    };

    useEffect(() => {
        getCollections();
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <div className="px-10 py-5">
            <div className="flex items-center justify-between">
                <p className="text-heading2-bold">Danh mục</p>
                <Button className="bg-blue-1 text-white" onClick={() => router.push("/collections/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo danh mục
                </Button>
            </div>
            <Separator className="bg-grey-1 my-4" />
            <DataTable columns={columns} data={collections} searchKey="title" />
        </div>
    );
};

export default Collections;
