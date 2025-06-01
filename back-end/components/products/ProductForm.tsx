"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "../customui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../customui/Delete";
import MultiText from "../customui/MultiText";
import MultiSelect from "../customui/MultiSelect";
import Loader from "../customui/Loader";
import WordLikeEditor from "../customui/WordLikeEditor";

const formSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(2).max(15000).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    price: z.coerce.number().min(1000),
    expense: z.coerce.number().min(1000),
    quantity: z.coerce.number().min(0),
});

interface ProductFormProps {
    initialData?: ProductType | null; // Must have "?" to make it optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<CollectionType[]>([]);

    const getCollections = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/collections", { method: "GET" });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.json();
            setCollections(data);
            setLoading(false);
        } catch (err) {
            console.log("[collections_GET]", err);
            toast.error("Something went wrong! Please try again.");
        }
    };

    useEffect(() => {
        getCollections();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  collections: initialData.collections.map(
                      (collection) => collection._id
                  ),
                  quantity: initialData.quantity ?? 0,
              }
            : {
                  title: "",
                  description: "",
                  media: [],
                  category: "",
                  collections: [],
                  tags: [],
                  sizes: [],
                  colors: [],
                  price: 1000,
                  expense: 1000,
                  quantity: 0,
              },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = initialData
                ? `/api/products/${initialData._id}`
                : "/api/products";
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setLoading(false);
                toast.success(`Product ${initialData ? "updated" : "created"}`);
                window.location.href = "/products";
                router.push("/products");
            }
        } catch (err) {
            console.log("[products_POST]", err);
            toast.error("Something went wrong! Please try again.");
        }
    };

    return loading ? (
        <Loader />
    ) : (
        <div className="p-10">
            {initialData ? (
                <div className="flex items-center justify-between">
                    <p className="text-heading2-bold">Sửa</p>
                    <Delete item="product" id={initialData._id} />
                </div>
            ) : (
                <p className="text-heading2-bold">Tạo sản phẩm</p>
            )}
            <Separator className="bg-grey-1 mt-4 mb-7" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên sản phẩm</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Tên sản phẩm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả sản phẩm</FormLabel>
                                <FormControl>
                                    <WordLikeEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ảnh sản phẩm</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(url) =>
                                            field.onChange([
                                                ...field.value,
                                                url,
                                            ])
                                        }
                                        onRemove={(url) =>
                                            field.onChange([
                                                ...field.value.filter(
                                                    (image) => image !== url
                                                ),
                                            ])
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá bán (đ)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Giá bán"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expense"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá nhập (đ)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Giá nhập"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Danh mục"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Màu sắc</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Màu sắc"
                                            value={field.value}
                                            onChange={(color) =>
                                                field.onChange([
                                                    ...field.value,
                                                    color,
                                                ])
                                            }
                                            onRemove={(sideToRemove) =>
                                                field.onChange([
                                                    ...field.value.filter(
                                                        (item) =>
                                                            item !==
                                                            sideToRemove
                                                    ),
                                                ])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        {collections.length > 0 && (
                            <FormField
                                control={form.control}
                                name="collections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại sản phẩm</FormLabel>
                                        <FormControl>
                                            {collections && (
                                                <MultiSelect
                                                    placeholder="Loại sản phẩm"
                                                    collections={collections}
                                                    value={field.value}
                                                    onChange={(id) =>
                                                        field.onChange([
                                                            ...field.value,
                                                            id,
                                                        ])
                                                    }
                                                    onRemove={(idToRemove) =>
                                                        field.onChange([
                                                            ...field.value.filter(
                                                                (
                                                                    collectionId
                                                                ) =>
                                                                    collectionId !==
                                                                    idToRemove
                                                            ),
                                                        ])
                                                    }
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />
                        )}
                        {/* <FormField
                            control={form.control}
                            name="sizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tình trạng</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Tình trạng"
                                            value={field.value}
                                            onChange={(size) => field.onChange([...field.value, size])}
                                            onRemove={(sideToRemove) =>
                                                field.onChange([...field.value.filter((item) => item !== sideToRemove)])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Tags"
                                            value={field.value}
                                            onChange={(tag) =>
                                                field.onChange([
                                                    ...field.value,
                                                    tag,
                                                ])
                                            }
                                            onRemove={(tagToRemove) =>
                                                field.onChange([
                                                    ...field.value.filter(
                                                        (items) =>
                                                            items !==
                                                            tagToRemove
                                                    ),
                                                ])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số lượng</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Số lượng sản phẩm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-10">
                        <Button type="submit" className="bg-blue-1 text-white">
                            Submit
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push("/products")}
                            className="bg-blue-1 text-white"
                        >
                            Discard
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ProductForm;
