import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import { FileText, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const execPerformance = [
  { name: "Rajesh", outlets: 42, orders: 125 },
  { name: "Priya", outlets: 38, orders: 110 },
  { name: "Sunita", outlets: 31, orders: 95 },
  { name: "Amit", outlets: 25, orders: 68 },
  { name: "Vikram", outlets: 22, orders: 55 },
];

const AdminReports = () => (
  <DashboardLayout role={adminConfig}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Analytics and performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export CSV</Button>
          <Button variant="outline" size="sm">Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹72.4L" change="+18%" changeType="up" icon={<TrendingUp className="h-5 w-5 text-primary" />} />
        <StatCard title="Total Orders" value="4,280" change="+22%" changeType="up" icon={<ShoppingCart className="h-5 w-5 text-primary" />} />
        <StatCard title="Invoices Generated" value="3,940" icon={<FileText className="h-5 w-5 text-primary" />} />
        <StatCard title="Active Executives" value="48" change="+6" changeType="up" icon={<Users className="h-5 w-5 text-primary" />} />
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
        <h3 className="font-semibold text-card-foreground mb-4">Executive Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={execPerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={60} />
            <Tooltip />
            <Bar dataKey="outlets" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} name="Outlets" />
            <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminReports;
