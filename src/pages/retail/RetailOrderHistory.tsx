import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { retailConfig } from "@/config/retailConfig";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const RetailOrderHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/myorders");
      return data;
    },
  });

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="text-sm text-muted-foreground">View past orders and download invoices</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Error loading orders.</div>
        ) : (
          <DataTable
            columns={[
              { header: "Order ID", accessor: (row: any) => row._id?.slice(-6).toUpperCase() },
              { header: "Items", accessor: (row: any) => String(row.items?.length ?? 0) },
              { header: "Amount", accessor: (row: any) => `₹${row.totalAmount?.toLocaleString()}` },
              { header: "Status", accessor: (row: any) => <StatusBadge status={row.status} /> },
              { header: "Date", accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
              {
                header: "Invoice",
                accessor: (row: any) =>
                  row.status === "delivered" ? (
                    <Button variant="ghost" size="sm" className="gap-1 text-primary h-7">
                      <Download className="h-3 w-3" /> PDF
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
            ]}
            data={data || []}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetailOrderHistory;
