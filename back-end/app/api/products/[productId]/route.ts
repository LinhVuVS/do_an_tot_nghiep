import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connectToDB();

        const product = await Product.findById(params.productId).populate({
            path: "collections",
            model: Collection,
        });

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(product), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (err) {
        console.log("[productId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectToDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const { title, description, media, category, collections, tags, sizes, colors, price, expense, quantity } =
            await req.json();

        if (!title || !description || !media || !category || !price || !expense || quantity === undefined) {
            return new NextResponse("Not enough data to create a new product", {
                status: 400,
            });
        }

        // Get current collections
        const currentCollections = product.collections.map((id: any) => id.toString());
        const newCollections = collections.map((id: string) => id.toString());

        // Find collections to add and remove
        const collectionsToAdd = newCollections.filter((id: string) => !currentCollections.includes(id));
        const collectionsToRemove = currentCollections.filter((id: string) => !newCollections.includes(id));

        // Update collections
        await Promise.all([
            // Add product to new collections
            ...collectionsToAdd.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, { $addToSet: { products: product._id } }, { new: true })
            ),
            // Remove product from old collections
            ...collectionsToRemove.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, { $pull: { products: product._id } }, { new: true })
            ),
        ]);

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            product._id,
            {
                title,
                description,
                media,
                category,
                collections: newCollections,
                tags,
                sizes,
                colors,
                price,
                expense,
                quantity,
            },
            { new: true }
        ).populate({ path: "collections", model: Collection });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (err) {
        console.log("[productId_POST]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectToDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        await Product.findByIdAndDelete(product._id);

        // Update collections
        await Promise.all(
            product.collections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id },
                })
            )
        );

        return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
            status: 200,
        });
    } catch (err) {
        console.log("[productId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
