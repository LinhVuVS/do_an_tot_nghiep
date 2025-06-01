import Customer from "../models/Customer";
import Order from "../models/Order";
import Product from "../models/Product";
import { connectToDB } from "../mongoDB";

export const getTotalSales = async () => {
    await connectToDB();
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    return { totalOrders, totalRevenue };
};

export const getTotalExpense = async () => {
    await connectToDB();
    const orders = await Order.find().populate("products.product");
    const totalExpense = orders.reduce((acc, order) => {
        const orderExpense = order.products.reduce((productAcc: number, product: any) => {
            const productExpense = product.product?.expense || 0;
            return productAcc + productExpense * product.quantity;
        }, 0);
        return acc + orderExpense;
    }, 0);
    return totalExpense;
};

export const getTotalCustomer = async () => {
    await connectToDB();
    const customers = await Customer.find();
    const totalCustomers = customers.length;
    return totalCustomers;
};

export const getSalesPerMonth = async () => {
    await connectToDB();
    const orders = await Order.find();

    const salesPerMonth = orders.reduce((acc, order) => {
        const monthIndex = new Date(order.createdAt).getMonth(); //thứ tự các tháng từ tháng 1 -> tháng 12
        acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount * 100;
        //vào tháng 5 thì monthIndex = 5
        //acc[5] = (acc[5] || 0) + order.totalAmount {tổng tiền hàng trong tháng 5}

        return acc;
    }, {});

    const graphData = Array.from({ length: 12 }, (_, i) => {
        const month = new Intl.DateTimeFormat("en-US", {
            month: "short",
        }).format(new Date(0, i));
        // if i == 7 => month = July
        return { name: month, sales: salesPerMonth[i] || 0 };
    });

    return graphData;
};
