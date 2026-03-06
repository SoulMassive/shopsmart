import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const AdminOrders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data;
    },
  });

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
            <p className="text-sm text-muted-foreground">Track and manage all orders</p>
          </div>
          <Button variant="outline" size="sm">Export CSV</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Error loading orders.</div>
        ) : (
          <DataTable
            columns={[
              { header: "Order ID", accessor: (row: any) => row._id?.slice(-6).toUpperCase() },
              { header: "Outlet", accessor: (row: any) => row.user?.name || "—" },
              { header: "Items", accessor: (row: any) => String(row.items?.length ?? 0) },
              { header: "Amount", accessor: (row: any) => `₹${row.totalAmount?.toLocaleString()}` },
              { header: "Status", accessor: (row: any) => <StatusBadge status={row.status} /> },
              { header: "Date", accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
            ]}
            data={data || []}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminOrders;
