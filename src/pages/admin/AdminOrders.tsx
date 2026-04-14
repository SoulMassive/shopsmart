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

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ["Order ID", "Outlet", "Original Price", "Discount", "Offer Applied", "Final Price", "Status", "Date"];
    const csvRows = [
      headers.join(","),
      ...data.map((row: any) => [
        row._id,
        `"${(row.outletId?.name || row.userId?.name || "").replace(/"/g, '""')}"`,
        row.subtotal || row.totalAmount,
        row.discountAmount || 0,
        row.discountType === "FIRST_ORDER" ? "First Order 50%" : "None",
        row.totalAmount,
        row.orderStatus || row.status,
        new Date(row.createdAt).toLocaleDateString()
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
            <p className="text-sm text-muted-foreground">Track and manage all orders</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={isLoading}>Export CSV</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Error loading orders.</div>
        ) : (
          <DataTable
            columns={[
              { header: "Order ID", accessor: (row: any) => row._id?.slice(-6).toUpperCase() || row.orderNumber },
              { header: "Outlet", accessor: (row: any) => row.outletId?.name || row.userId?.name || "—" },
              { header: "Original", accessor: (row: any) => `₹${(row.subtotal || row.totalAmount)?.toLocaleString()}` },
              { header: "Discount", accessor: (row: any) => row.discountAmount ? `-₹${row.discountAmount.toLocaleString()}` : "—" },
              { header: "Offer", accessor: (row: any) => row.discountType === "FIRST_ORDER" ? "First Order 50%" : "—" },
              { header: "Final", accessor: (row: any) => `₹${row.totalAmount?.toLocaleString()}` },
              { header: "Status", accessor: (row: any) => <StatusBadge status={row.orderStatus || row.status} /> },
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
