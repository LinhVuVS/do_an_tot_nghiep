import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
    let session: mongoose.ClientSession | null = null;

    try {
        const rawBody = await req.text();
        const signature = req.headers.get("Stripe-Signature") as string;
        console.log("[webhooks_POST] Received webhook with signature:", signature);

        const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        console.log("[webhooks_POST] Event type:", event.type);

        // Chỉ xử lý event checkout.session.completed
        if (event.type !== "checkout.session.completed") {
            console.log("[webhooks_POST] Ignoring non-checkout event:", event.type);
            return new NextResponse("Event ignored", { status: 200 });
        }

        const stripeSession = event.data.object;
        const sessionId = stripeSession.id;
        console.log("[webhooks_POST] Processing checkout session:", {
            id: sessionId,
            clientReferenceId: stripeSession.client_reference_id,
            amount: stripeSession.amount_total,
        });

        await connectToDB();

        // Bắt đầu transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // Kiểm tra xem đơn hàng với session ID này đã tồn tại chưa
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId }).session(session);
        console.log("[webhooks_POST] Existing order check:", existingOrder ? "Found" : "Not found");

        if (existingOrder) {
            console.log("[webhooks_POST] Order already exists for session:", sessionId);
            await session.abortTransaction();
            return new NextResponse("Order already exists", { status: 200 });
        }

        const customerInfo = {
            clerkId: stripeSession?.client_reference_id,
            name: stripeSession?.customer_details?.name,
            email: stripeSession?.customer_details?.email,
        };
        console.log("[webhooks_POST] Customer info:", customerInfo);

        const shippingAddress = {
            street: stripeSession?.shipping_details?.address?.line1,
            city: stripeSession?.shipping_details?.address?.city,
            state: stripeSession?.shipping_details?.address?.state,
            postalCode: stripeSession?.shipping_details?.address?.postal_code,
            country: stripeSession?.shipping_details?.address?.country,
        };
        console.log("[webhooks_POST] Shipping address:", shippingAddress);

        const retrieveSession = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items.data.price.product"],
        });
        console.log("[webhooks_POST] Retrieved session line items:", retrieveSession?.line_items?.data?.length || 0);

        const lineItems = await retrieveSession?.line_items?.data;
        const orderItems = lineItems?.map((item: any) => {
            return {
                product: item.price.product.metadata.productId,
                color: item.price.product.metadata.color || "N/A",
                size: item.price.product.metadata.size || "N/A",
                quantity: item.quantity,
                expense: Number(item.price.product.metadata.expense) || 0,
            };
        });
        console.log("[webhooks_POST] Processed order items:", orderItems?.length || 0);

        // Tạo đơn hàng mới trong transaction
        const newOrder = new Order({
            customerClerkId: customerInfo.clerkId,
            products: orderItems,
            shippingAddress,
            shippingRate: stripeSession?.shipping_cost?.shipping_rate,
            totalAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : 0,
            stripeSessionId: sessionId, // Thêm stripeSessionId
        });

        await newOrder.save({ session });
        console.log("[webhooks_POST] New order saved with ID:", newOrder._id);

        // Trừ số lượng sản phẩm trong transaction
        if (orderItems && orderItems.length > 0) {
            for (const item of orderItems) {
                const updatedProduct = await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { quantity: -item.quantity } },
                    { new: true, session }
                );
                console.log("[webhooks_POST] Updated product quantity:", {
                    productId: item.product,
                    newQuantity: updatedProduct?.quantity,
                });
            }
        }

        // Tìm hoặc tạo customer trong transaction
        let customer = await Customer.findOne({ clerkId: customerInfo.clerkId }).session(session);
        console.log("[webhooks_POST] Existing customer check:", customer ? "Found" : "Not found");

        if (customer) {
            customer.orders.push(newOrder._id);
        } else {
            customer = new Customer({
                ...customerInfo,
                orders: [newOrder._id],
            });
        }

        await customer.save({ session });
        console.log("[webhooks_POST] Customer updated with new order");

        // Commit transaction
        await session.commitTransaction();
        console.log("[webhooks_POST] Transaction committed successfully");

        return new NextResponse("Order created", { status: 200 });
    } catch (err) {
        console.log("[webhooks_POST] Error:", err);
        // Rollback transaction nếu có lỗi
        if (session) {
            await session.abortTransaction();
            console.log("[webhooks_POST] Transaction aborted due to error");
        }
        return new NextResponse("Failed to create the order", { status: 500 });
    } finally {
        // Đóng session
        if (session) {
            session.endSession();
        }
    }
};

export const dynamic = "force-dynamic";
