"use client";

import useCart from "@/lib/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Heart, Menu, Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const cart = useCart();

    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [isProductsHovered, setIsProductsHovered] = useState(false);
    const [query, setQuery] = useState("");

    return (
        <div className="sticky h-[110px] w-full top-0 z-10 py-2 px-[60px] flex gap-2 justify-between items-center bg-white shadow-sm max-sm:px-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image src="/momoko_logo.png" alt="logo" width={250} height={100} />
            </Link>

            <div className="flex gap-8 text-base-bold max-lg:hidden">
                <Link
                    href="/"
                    className={`relative hover:text-[#2f6950] transition-colors duration-300 text-[20px] group ${
                        pathname === "/" ? "text-[#2f6950]" : ""
                    }`}
                >
                    Trang chủ
                    <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2f6950] transition-all duration-300 group-hover:w-full ${
                            pathname === "/" ? "w-full" : ""
                        }`}
                    ></span>
                </Link>
                <div
                    className="relative"
                    onMouseEnter={() => setIsProductsHovered(true)}
                    onMouseLeave={() => setIsProductsHovered(false)}
                >
                    <Link
                        href="/products"
                        className={`relative hover:text-[#2f6950] transition-colors duration-300 text-[20px] group ${
                            pathname === "/products" ? "text-[#2f6950]" : ""
                        }`}
                    >
                        Sản phẩm
                        <span
                            className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2f6950] transition-all duration-300 group-hover:w-full ${
                                pathname === "/products" ? "w-full" : ""
                            }`}
                        ></span>
                    </Link>
                    {isProductsHovered && (
                        <>
                            <div className="absolute top-full left-0 h-2 w-full bg-transparent"></div>
                            <div className="absolute top-full left-[-50%] py-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-48 z-20 transform transition-all duration-300 ease-in-out">
                                <Link
                                    href="/collections/676929bb87072794fdae96cb"
                                    className="block px-4 py-3 hover:bg-[#2f6950] hover:text-white transition-colors duration-300"
                                >
                                    Switch
                                </Link>
                                <Link
                                    href="/collections/6768cf3d4e55ff053d29d24f"
                                    className="block px-4 py-3 hover:bg-[#2f6950] hover:text-white transition-colors duration-300"
                                >
                                    Keycaps
                                </Link>
                                <Link
                                    href="/collections/6768ceb44e55ff053d29d240"
                                    className="block px-4 py-3 hover:bg-[#2f6950] hover:text-white transition-colors duration-300"
                                >
                                    Keyboards
                                </Link>
                                <Link
                                    href="/collections/6768cf714e55ff053d29d255"
                                    className="block px-4 py-3 hover:bg-[#2f6950] hover:text-white transition-colors duration-300"
                                >
                                    Keyboard Kits
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <Link
                    href={user ? "/orders" : "/sign-in"}
                    className={`relative hover:text-[#2f6950] transition-colors duration-300 text-[20px] group ${
                        pathname === "/orders" ? "text-[#2f6950]" : ""
                    }`}
                >
                    Đơn hàng
                    <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2f6950] transition-all duration-300 group-hover:w-full ${
                            pathname === "/orders" ? "w-full" : ""
                        }`}
                    ></span>
                </Link>
                <Link
                    href="/contacts"
                    className={`relative hover:text-[#2f6950] transition-colors duration-300 text-[20px] group ${
                        pathname === "/contacts" ? "text-[#2f6950]" : ""
                    }`}
                >
                    Liên hệ
                    <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2f6950] transition-all duration-300 group-hover:w-full ${
                            pathname === "/contacts" ? "w-full" : ""
                        }`}
                    ></span>
                </Link>
            </div>

            <div className="flex gap-3 border w-[400px] max-xl:w-auto border-grey-2 px-4 py-3 items-center rounded-2xl hover:border-[#2f6950] transition-colors duration-300 focus-within:border-[#2f6950] focus-within:ring-1 focus-within:ring-[#2f6950]">
                <input
                    className="outline-none w-full max-sm:max-w-[120px] bg-transparent"
                    placeholder="Tìm kiếm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    disabled={query === ""}
                    onClick={() => router.push(`/search/${query}`)}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Search className="cursor-pointer h-4 w-4 hover:text-[#2f6950] transition-colors duration-300" />
                </button>
            </div>

            <div className="relative flex gap-3 items-center">
                <Link
                    href={user ? "/wishlist" : "/sign-in"}
                    className={`group hover:text-white transition-all duration-300 ${
                        pathname === "/wishlist" ? "text-[#2f6950]" : ""
                    } flex items-center gap-3 border rounded-lg px-4 py-3 hover:bg-[#2f6950] max-md:hidden`}
                >
                    <Heart className="fill-current group-hover:fill-white transition-colors duration-300" />
                </Link>

                <Link
                    href="/cart"
                    className="flex items-center gap-3 border rounded-lg px-4 py-3 hover:bg-[#2f6950] hover:text-white transition-all duration-300 max-md:hidden group"
                >
                    <ShoppingCart className="group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-base-bold">({cart.cartItems.length})</p>
                </Link>

                <Menu
                    className="cursor-pointer lg:hidden hover:text-[#2f6950] transition-colors duration-300"
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                />

                {dropdownMenu && (
                    <div className="absolute top-12 right-5 flex flex-col gap-4 p-4 rounded-lg border bg-white text-base-bold lg:hidden shadow-lg animate-fadeIn">
                        <Link href="/" className="hover:text-[#2f6950] transition-colors duration-300">
                            Trang chủ
                        </Link>
                        <Link href="/products" className="hover:text-[#2f6950] transition-colors duration-300">
                            Sản phẩm
                        </Link>
                        <Link
                            href={user ? "/orders" : "/sign-in"}
                            className="hover:text-[#2f6950] transition-colors duration-300"
                        >
                            Đơn hàng
                        </Link>
                        <Link href="/contacts" className="hover:text-[#2f6950] transition-colors duration-300">
                            Liên hệ
                        </Link>
                        <Link
                            href="/cart"
                            className="flex items-center gap-3 border rounded-lg px-4 py-2 hover:bg-[#2f6950] hover:text-white transition-all duration-300"
                        >
                            <ShoppingCart className="group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-base-bold">({cart.cartItems.length})</p>
                        </Link>
                        <Link
                            href={user ? "/wishlist" : "/sign-in"}
                            className="flex items-center gap-3 border rounded-lg px-4 py-2 hover:bg-[#2f6950] hover:text-white transition-all duration-300"
                        >
                            <Heart className="group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-base-bold">Wishlist</p>
                        </Link>
                    </div>
                )}

                {user ? (
                    <UserButton afterSignOutUrl="/sign-in" />
                ) : (
                    <Link href="/sign-in" className="hover:text-[#2f6950] transition-colors duration-300">
                        <CircleUserRound className="w-6 h-6" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
