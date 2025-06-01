import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSalesPerMonth, getTotalCustomer, getTotalExpense, getTotalSales } from "@/lib/actions/actions";
import { UserButton } from "@clerk/nextjs";
import SalesChart from "@/components/customui/SalesChart";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
    const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
    const totalExpense = await getTotalExpense();
    const totalOrders = await getTotalSales().then((data) => data.totalOrders);
    const totalCustomers = await getTotalCustomer();

    const graphData = await getSalesPerMonth();

    return (
        <div className="px-8 py-10">
            <p className="text-heading2-bold">Dashboard</p>
            <Separator className="bg-grey-1 my-5" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Tổng doanh thu</CardTitle>
                        <CircleDollarSign className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-bold">{Number(totalRevenue * 100).toLocaleString("vi-VN")} đ</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Tổng lợi nhuận</CardTitle>
                        <CircleDollarSign className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-bold">
                            {Number(totalRevenue * 100 - totalExpense).toLocaleString("vi-VN")} đ
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Số đơn hàng</CardTitle>
                        <ShoppingBag className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-bold">{totalOrders}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Số khách hàng</CardTitle>
                        <UserRound className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-bold">{totalCustomers}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-10">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Sales Chart (đ)</CardTitle>
                    <UserRound className="max-sm:hidden" />
                </CardHeader>
                <CardContent>
                    <SalesChart data={graphData} />
                </CardContent>
            </Card>
        </div>
    );
}
