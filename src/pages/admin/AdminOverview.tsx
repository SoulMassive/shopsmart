import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminConfig } from "@/config/adminConfig";
import { Users, ShoppingCart, Store, TrendingUp, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const AdminOverview = () => {
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data || [];
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data || [];
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.products || [];
    },
  });

  // Compute real stats
  const totalRevenue = orders?.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0) || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  // Build chart data from real orders grouped by month
  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
  (orders || []).forEach((o: any) => {
    const month = new Date(o.createdAt).toLocaleString("default", { month: "short" });
    if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, orders: 0 };
    monthlyMap[month].revenue += o.totalAmount || 0;
    monthlyMap[month].orders += 1;
  });
  const chartData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">Your distribution network at a glance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={String(users?.length || 0)} icon={<Store className="h-5 w-5 text-primary" />} />
          <StatCard title="Products" value={String(productsData?.length || 0)} icon={<Users className="h-5 w-5 text-primary" />} />
          <StatCard title="Total Orders" value={String(orders?.length || 0)} icon={<ShoppingCart className="h-5 w-5 text-primary" />} />
          <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5 text-primary" />} />
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-card-foreground mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-card-foreground mb-4">Orders Per Month</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {ordersLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <DataTable
            title="Recent Orders"
            columns={[
              { header: "Order ID", accessor: (row: any) => row._id?.slice(-6).toUpperCase() },
              { header: "Outlet", accessor: (row: any) => row.user?.name || "—" },
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

export default AdminOverview;
