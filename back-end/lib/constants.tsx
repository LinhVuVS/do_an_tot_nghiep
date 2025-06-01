import { Album, LayoutDashboard, Shapes, ShoppingBag, Tag, UsersRound } from "lucide-react";

export const navLinks = [
    {
        url: "/",
        icon: <LayoutDashboard />,
        label: "Dashboard",
    },
    {
        url: "/collections",
        icon: <Shapes />,
        label: "Danh mục",
    },
    {
        url: "/products",
        icon: <Tag />,
        label: "Sản phẩm",
    },
    {
        url: "/orders",
        icon: <ShoppingBag />,
        label: "Đơn hàng",
    },
    {
        url: "/customers",
        icon: <UsersRound />,
        label: "Khách hàng",
    },
];
