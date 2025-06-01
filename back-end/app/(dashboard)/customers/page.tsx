import { columns } from "@/components/customers/CustomerColumns";
import { DataTable } from "@/components/customui/DataTable";
import { Separator } from "@/components/ui/separator";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

const Customers = async () => {
    await connectToDB();

    const customers = await Customer.find().sort({ createdAt: "desc" });

    // Convert MongoDB objects to plain objects
    const plainCustomers = customers.map((customer) => ({
        _id: customer._id.toString(),
        clerkId: customer.clerkId,
        name: customer.name,
        email: customer.email,
        orders: customer.orders.map((order: any) => order.toString()),
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        __v: customer.__v,
    }));

    return (
        <div className="px-10 py-5">
            <p className="text-heading2-bold">Customers</p>
            <Separator className="bg-grey-1 my-5" />
            <DataTable columns={columns} data={plainCustomers} searchKey="name" />
        </div>
    );
};

export const dynamic = "force-dynamic";

export default Customers;
