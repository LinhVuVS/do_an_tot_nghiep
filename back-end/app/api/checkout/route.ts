import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        const { cartItems, customer } = await req.json();

        if (!cartItems || !customer) {
            return new NextResponse("Not enough data to checkout", { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["US", "VN"],
            },
            shipping_options: [
                { shipping_rate: "shr_1Q3uCEBs0RBlU7arAaE2aWFu" },
                { shipping_rate: "shr_1QckKJBs0RBlU7arrHX1mYN9" },
                { shipping_rate: "shr_1QckJpBs0RBlU7arBCLBsJUO" },
            ],
            line_items: cartItems.map((cartItem: any) => ({
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: cartItem.item.title,
                        metadata: {
                            productId: cartItem.item._id,
                            ...(cartItem.size && { size: cartItem.size }),
                            ...(cartItem.color && { color: cartItem.color }),
                            expense: cartItem.item.expense || 0,
                        },
                    },
                    unit_amount: cartItem.item.price,
                },
                quantity: cartItem.quantity,
            })),
            client_reference_id: customer.clerkId,
            success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
            cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
        });

        return NextResponse.json(session, { headers: corsHeaders });
    } catch (err) {
        console.log("[checkout_POST]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
