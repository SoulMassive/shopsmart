import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Loader2, TrendingUp, ShoppingCart, Users, Package } from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BulkReportsDashboard from "@/components/admin/bulk/BulkReportsDashboard";
import { Database } from "lucide-react";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const AdminReports = () => {
    const [range, setRange] = useState("30"); // 7, 30, 90
    const [useBulkData, setUseBulkData] = useState(false);
    
    // Calculate dates based on range
    const getDates = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - parseInt(range));
        return { 
            from: start.toISOString().split('T')[0], 
            to: end.toISOString().split('T')[0] 
        };
    };

    const { from, to } = getDates();

    const { data, isLoading, error } = useQuery({
        queryKey: ["adminReports", range, useBulkData],
        queryFn: async () => {
            if (useBulkData) return null; // We use BulkReportsDashboard for this
            const { data } = await api.get(`/admin/analytics/reports?from=${from}&to=${to}`);
            return data;
        },
        enabled: !useBulkData
    });

    const handleExport = () => {
        if (!data) return;
        const headers = ["Metric", "Value"];
        const rows = [
            ["Total Revenue", data.summary.totalRevenue],
            ["Total Orders", data.summary.totalOrders],
            ["Avg Order Value", data.summary.avgOrderValue],
            ["Active Outlets", data.summary.activeOutlets],
            [],
            ["Top Products", "Units Sold", "Revenue"],
            ...data.topProducts.map((p: any) => [p.name, p.unitsSold, p.revenue])
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
            
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `report_${from}_to_${to}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report exported");
    };

    if (error) return (
        <DashboardLayout role={adminConfig}>
            <div className="flex items-center justify-center h-64 text-destructive font-medium">
                Failed to load report data.
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout role={adminConfig}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Business Intelligence</h1>
                        <p className="text-sm text-muted-foreground">Deep dive into sales and performance metrics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2 bg-muted/30 px-3 py-2 rounded-lg border border-border">
                            <Database className={`h-4 w-4 ${useBulkData ? "text-primary" : "text-muted-foreground"}`} />
                            <Label htmlFor="bulk-mode" className="text-xs font-semibold cursor-pointer">Use Bulk Data</Label>
                            <Switch 
                                id="bulk-mode" 
                                checked={useBulkData} 
                                onCheckedChange={setUseBulkData} 
                            />
                        </div>
                        {!useBulkData && (
                            <div className="flex items-center gap-2">
                                <Select value={range} onValueChange={setRange}>
                                    <SelectTrigger className="w-[140px]">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">Last 7 Days</SelectItem>
                                        <SelectItem value="30">Last 30 Days</SelectItem>
                                        <SelectItem value="90">Last 90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={isLoading}>
                                    <Download size={16} /> Export CSV
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {useBulkData ? (
                    <BulkReportsDashboard />
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Aggregating report data...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard 
                                title="Total Revenue" 
                                value={`₹${data.summary.totalRevenue.toLocaleString()}`} 
                                icon={<TrendingUp className="h-5 w-5 text-green-500" />} 
                            />
                            <StatCard 
                                title="Total Orders" 
                                value={data.summary.totalOrders.toLocaleString()} 
                                icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} 
                            />
                            <StatCard 
                                title="Avg Order Value" 
                                value={`₹${Math.round(data.summary.avgOrderValue).toLocaleString()}`} 
                                icon={<Package className="h-5 w-5 text-orange-500" />} 
                            />
                            <StatCard 
                                title="Active Outlets" 
                                value={data.summary.activeOutlets.toString()} 
                                icon={<Users className="h-5 w-5 text-purple-500" />} 
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Line Chart */}
                            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card">
                                <h3 className="font-semibold text-card-foreground mb-6">Revenue Trend (Daily)</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.revenueOverTime}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fontSize: 11 }} 
                                                stroke="hsl(var(--muted-foreground))"
                                                tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11 }} 
                                                stroke="hsl(var(--muted-foreground))"
                                                tickFormatter={(val) => `₹${val/1000}k`}
                                            />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                                formatter={(val: number) => [`₹${val.toLocaleString()}`, "Revenue"]}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="revenue" 
                                                stroke="hsl(var(--primary))" 
                                                strokeWidth={2} 
                                                dot={{ r: 4 }} 
                                                activeDot={{ r: 6 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Orders Status Pie Chart */}
                            <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                                <h3 className="font-semibold text-card-foreground mb-6">Order Status</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.ordersByStatus}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {data.ordersByStatus.map((_:any, index:number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Products Table */}
                            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
                                <div className="p-5 border-b border-border bg-muted/30">
                                    <h3 className="font-semibold text-card-foreground">Top Products by Revenue</h3>
                                </div>
                                <DataTable 
                                    columns={[
                                        { header: "Product", accessor: (p:any) => p.name },
                                        { header: "Sold", accessor: (p:any) => p.unitsSold },
                                        { header: "Revenue", accessor: (p:any) => `₹${p.revenue.toLocaleString()}` },
                                        { header: "%", accessor: (p:any) => `${p.percent.toFixed(1)}%` },
                                    ]}
                                    data={data.topProducts}
                                />
                            </div>

                            {/* Top Outlets Table */}
                            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
                                <div className="p-5 border-b border-border bg-muted/30">
                                    <h3 className="font-semibold text-card-foreground">Top Performing Outlets</h3>
                                </div>
                                <DataTable 
                                    columns={[
                                        { header: "Outlet", accessor: (o:any) => o.name },
                                        { header: "Orders", accessor: (o:any) => o.orderCount },
                                        { header: "Total Spend", accessor: (o:any) => `₹${o.totalSpend.toLocaleString()}` },
                                    ]}
                                    data={data.topOutlets}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminReports;
