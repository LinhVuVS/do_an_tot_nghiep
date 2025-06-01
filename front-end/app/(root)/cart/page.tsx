"use client";

import Image from "next/image";
import useCart from "@/lib/hooks/useCart";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Cart = () => {
    const router = useRouter();
    const { user } = useUser();
    const cart = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const total = cart.cartItems.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0);
    const totalRounded = parseFloat(total.toFixed(2));

    const formatPrice = (price: number) => {
        return price.toLocaleString("vi-VN") + " đ";
    };

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            if (!user) {
                router.push("sign-in");
                return;
            }
            const customer = {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: user.fullName,
            };

            // Prepare cart items with expense information
            const cartItemsWithExpense = cart.cartItems.map((item) => ({
                ...item,
                expense: item.item.expense || 0,
            }));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                method: "POST",
                body: JSON.stringify({
                    cartItems: cartItemsWithExpense,
                    customer,
                }),
            });
            const data = await res.json();
            window.location.href = data.url;
        } catch (err) {
            console.log("checkout_POST", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-20 py-16 px-10 max-lg:flex-col">
            <div className="w-2/3 max-lg:w-full">
                <p className="text-heading3-bold">Giỏ hàng</p>
                <hr className="my-6" />
                {cart.cartItems.length === 0 ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-body-bold">Không có sản phẩm nào trong giỏ hàng</p>
                        <button
                            className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-[#2f6950] hover:text-white"
                            onClick={() => router.push("/")}
                        >
                            Quay lại cửa hàng
                        </button>
                    </div>
                ) : (
                    <div>
                        {cart.cartItems.map((cartItem) => (
                            <div
                                key={cartItem.item._id}
                                className="flex max-sm:flex-col max-sm:gap-6 items-center justify-between gap-2 p-4 border-b border-gray-200 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <Image
                                        src={cartItem.item.media[0]}
                                        width={100}
                                        height={100}
                                        className="rounded-lg object-cover"
                                        alt="product"
                                    />
                                    <div className="flex flex-col gap-2 flex-1">
                                        <p className="text-body-bold truncate max-w-[200px]">{cartItem.item.title}</p>
                                        {cartItem.color && <p className="text-small-medium">{cartItem.color}</p>}
                                        {cartItem.size && <p className="text-small-medium">{cartItem.size}</p>}
                                        <p className="text-small-medium">{formatPrice(cartItem.item.price)}</p>
                                    </div>
                                </div>
                                <div className="flex max-sm: items-center gap-8">
                                    <div className="flex items-center gap-4">
                                        <MinusCircle
                                            className="w-5 h-5 hover:text-red-500 cursor-pointer"
                                            onClick={() => cart.decreasesQuantity(cartItem.item._id)}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            max={cartItem.item.quantity}
                                            value={cartItem.quantity}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                    // Allow empty input
                                                    cart.updateQuantity(cartItem.item._id, 0);
                                                } else {
                                                    const newQuantity = parseInt(value);
                                                    if (newQuantity >= 1 && newQuantity <= cartItem.item.quantity) {
                                                        cart.updateQuantity(cartItem.item._id, newQuantity);
                                                    } else if (newQuantity > cartItem.item.quantity) {
                                                        toast.error("Số lượng không được vượt quá số lượng trong kho");
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // If input is empty or 0, set quantity to 1
                                                if (e.target.value === "" || parseInt(e.target.value) === 0) {
                                                    cart.updateQuantity(cartItem.item._id, 1);
                                                }
                                            }}
                                            className="w-16 text-center border rounded-md py-1 text-body-bold"
                                        />
                                        <PlusCircle
                                            className={`w-5 h-5 cursor-pointer ${
                                                cartItem.quantity >= cartItem.item.quantity
                                                    ? "text-gray-400"
                                                    : "hover:text-red-500"
                                            }`}
                                            onClick={() => {
                                                if (cartItem.quantity < cartItem.item.quantity) {
                                                    cart.increasesQuantity(cartItem.item._id);
                                                } else {
                                                    toast.error("Đã đạt giới hạn số lượng sản phẩm trong kho");
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-small-medium text-gray-500">
                                            Còn lại: {cartItem.item.quantity - cartItem.quantity}
                                        </p>
                                        <Trash
                                            className="w-5 h-5 hover:text-red-500 cursor-pointer"
                                            onClick={() => cart.removeItems(cartItem.item._id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
                <p className="text-heading4-bold pb-4">
                    Tổng tiền <span>{`(${cart.cartItems.length} sản phẩm)`}</span>
                </p>
                <div className="flex justify-between text-body-semibold">
                    <span>Tổng</span>
                    <span>{formatPrice(totalRounded)}</span>
                </div>
                <button
                    className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-[#2f6950] hover:text-white"
                    onClick={handleCheckout}
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default Cart;

export const dynamic = "force-dynamic";
