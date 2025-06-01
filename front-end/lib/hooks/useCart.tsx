import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
    item: ProductType;
    quantity: number;
    color?: string; // ? có nghĩa là tùy chọn
    size?: string;
}

interface CartStore {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    removeItems: (_id: string) => void;
    increasesQuantity: (_id: string) => void;
    decreasesQuantity: (_id: string) => void;
    updateQuantity: (_id: string, quantity: number) => void;
    clearCart: () => void;
}

const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            cartItems: [],
            addItem: (data: CartItem) => {
                const { item, quantity, color, size } = data;
                const currentItems = get().cartItems; // Những sản phẩm có sẵn trong cart
                const isExisting = currentItems.find((cartItem) => cartItem.item._id === item._id);
                if (isExisting) {
                    return toast("Sản phẩm đã có trong giỏ hàng");
                }

                set({ cartItems: [...currentItems, { item, quantity, color, size }] });
                toast.success("Đã thêm sản phẩm vào giỏ hàng");
            },

            removeItems: (_idToRemove: string) => {
                const newCartItems = get().cartItems.filter((cartItem) => cartItem.item._id !== _idToRemove);
                set({ cartItems: newCartItems });
                toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
            },
            increasesQuantity: (_idToIncrease: string) => {
                const newCartItems = get().cartItems.map((cartItem) =>
                    cartItem.item._id === _idToIncrease ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
                set({ cartItems: newCartItems });
                toast.success("Đã tăng số lượng sản phẩm");
            },
            decreasesQuantity: (_idToDecrease: string) => {
                const currentCartItems = get().cartItems;
                const updatedCartItems = currentCartItems.map((cartItem) =>
                    cartItem.item._id === _idToDecrease
                        ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
                        : cartItem
                );

                // Lọc ra những sản phẩm có số lượng lớn hơn 0
                const filteredCartItems = updatedCartItems.filter((cartItem) => cartItem.quantity > 0);

                set({ cartItems: filteredCartItems });

                if (filteredCartItems.length < updatedCartItems.length) {
                    toast.success("Sản phẩm đã được xóa khỏi giỏ hàng do số lượng bằng 0");
                } else {
                    toast.success("Đã giảm số lượng sản phẩm");
                }
            },
            updateQuantity: (_id: string, quantity: number) => {
                const currentCartItems = get().cartItems;
                const updatedCartItems = currentCartItems.map((cartItem) =>
                    cartItem.item._id === _id ? { ...cartItem, quantity } : cartItem
                );
                set({ cartItems: updatedCartItems });
            },
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;
