import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { retailConfig } from "@/config/retailConfig";
import { ShoppingCart, Package, Clock, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const RetailDashboard = () => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/my");
      return data || [];
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.products || [];
    },
  });

  const totalSpent = orders?.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) || 0;
  const pendingOrders = orders?.filter((o: any) => ["pending", "confirmed"].includes(o.status)).length || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name || "Store"}</h1>
          <p className="text-sm text-muted-foreground">Here's your outlet overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={String(orders?.length || 0)} icon={<ShoppingCart className="h-5 w-5 text-primary" />} />
          <StatCard title="Products Available" value={String(products?.length || 0)} icon={<Package className="h-5 w-5 text-primary" />} />
          <StatCard title="Pending Orders" value={String(pendingOrders)} icon={<Clock className="h-5 w-5 text-primary" />} />
          <StatCard title="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5 text-primary" />} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <DataTable
            title="Recent Orders"
            columns={[
              { header: "Order ID", accessor: (row: any) => row._id?.slice(-6).toUpperCase() },
              { header: "Items", accessor: (row: any) => String(row.items?.length ?? 0) },
              { header: "Amount", accessor: (row: any) => `₹${row.totalAmount?.toLocaleString()}` },
              { header: "Status", accessor: (row: any) => <StatusBadge status={row.status} /> },
              { header: "Date", accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
            ]}
            data={recentOrders}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetailDashboard;
