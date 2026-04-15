import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package, CheckCircle2, Factory, Loader2, Phone, Mail, MoreVertical } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import api from "@/lib/api";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminBulkOrders = () => {
    const queryClient = useQueryClient();

    const { data: bulkOrders, isLoading } = useQuery({
        queryKey: ["adminBulkOrders"],
        queryFn: async () => {
            const { data } = await api.get("/bulk-order");
            return data;
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status, contacted }: { id: string; status?: string; contacted?: boolean }) => {
            const payload: any = {};
            if (status) payload.status = status;
            if (contacted !== undefined) payload.contacted = contacted;
            
            await api.patch(`/bulk-order/${id}`, payload);
        },
        onSuccess: () => {
            toast.success("Order updated successfully");
            queryClient.invalidateQueries({ queryKey: ["adminBulkOrders"] });
        },
        onError: () => {
            toast.error("Failed to update order");
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout role={adminConfig}>
                <div className="flex h-full items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={adminConfig}>
            <div className="flex flex-col h-full">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Factory className="h-6 w-6 text-green-600" />
                            Bulk Order Requests
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage B2B wholesale order inquiries</p>
                    </div>
                </header>

                <main className="flex-1 pb-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Customer Details</th>
                                    <th className="p-4 font-medium">Requirements</th>
                                    <th className="p-4 font-medium">Contacted</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bulkOrders?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No bulk orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    bulkOrders?.map((order: any) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {format(new Date(order.createdAt), "hh:mm a")}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-bold text-gray-900">{order.name}</div>
                                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {order.phone}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {order.email}
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-xs">
                                                <div className="text-sm font-semibold text-gray-800">
                                                    {order.productName} <span className="text-green-600 opacity-80">({order.quantity})</span>
                                                </div>
                                                {order.requirements && (
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2" title={order.requirements}>
                                                        {order.requirements}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => updateStatus.mutate({ id: order._id, contacted: !order.contacted })}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        order.contacted 
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    } transition-colors cursor-pointer border`}
                                                >
                                                    {order.contacted ? 'Yes' : 'No'}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Confirmed' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
                                                            <MoreVertical className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => updateStatus.mutate({ id: order._id, status: 'Pending' })}>
                                                            Mark as Pending
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus.mutate({ id: order._id, status: 'Confirmed' })}>
                                                            Mark as Confirmed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus.mutate({ id: order._id, status: 'Completed' })}>
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default AdminBulkOrders;
