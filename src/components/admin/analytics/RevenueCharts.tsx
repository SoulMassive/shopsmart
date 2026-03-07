import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

const RevenueCharts = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["revenueData"],
        queryFn: async () => {
            const { data } = await api.get("/admin/analytics/revenue");
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    const { monthlyRevenue, dailyOrders, brandRevenue } = data || { monthlyRevenue: [], dailyOrders: [], brandRevenue: [] };
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {/* Monthly Revenue Trend - Line Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px]">
                <h3 className="font-semibold text-card-foreground mb-4">Monthly Revenue Trend</h3>
                <div className="w-full h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="hsl(var(--muted-foreground))"
                                tickFormatter={(val) => `₹${val / 1000}k`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Daily Orders - Area Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px]">
                <h3 className="font-semibold text-card-foreground mb-4">Daily Order Volume</h3>
                <div className="w-full h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyOrders} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11 }}
                                stroke="hsl(var(--muted-foreground))"
                                tickFormatter={(val) => new Date(val).getDate().toString()}
                            />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="orders" stroke="#10b981" fillOpacity={1} fill="url(#colorOrders)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue By Brand - Pie Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px]">
                <h3 className="font-semibold text-card-foreground mb-4">Revenue by Brand</h3>
                <div className="w-full h-[260px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={brandRevenue}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {brandRevenue.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueCharts;
