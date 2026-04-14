import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, TrendingUp, ShoppingCart, Users, Package, Award } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const BulkReportsDashboard = () => {
    const { data: reportData, isLoading } = useQuery({
        queryKey: ["bulkReports"],
        queryFn: async () => {
            const { data } = await api.get("/bulk/reports");
            return data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Analyzing bulk data records...</p>
            </div>
        );
    }

    if (!reportData) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Sales (Bulk)" 
                    value={`₹${reportData.overview.totalSales.toLocaleString()}`} 
                    icon={<TrendingUp className="h-5 w-5 text-green-500" />} 
                />
                <StatCard 
                    title="Total Records" 
                    value={reportData.overview.totalOrders.toLocaleString()} 
                    icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} 
                />
                <StatCard 
                    title="Avg Unit Price" 
                    value={`₹${Math.round(reportData.overview.avgPrice).toLocaleString()}`} 
                    icon={<Package className="h-5 w-5 text-orange-500" />} 
                />
                <StatCard 
                    title="Top Category" 
                    value={reportData.categoryStats[0]?._id || "N/A"} 
                    icon={<Award className="h-5 w-5 text-purple-500" />} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card">
                    <h3 className="font-semibold text-card-foreground mb-6">Sales Trend over Time</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={reportData.salesOverTime}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="_id" tick={{fontSize: 11}} stroke="hsl(var(--muted-foreground))" />
                                <YAxis tick={{fontSize: 11}} stroke="hsl(var(--muted-foreground))" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    formatter={(val: number) => [`₹${val.toLocaleString()}`, "Sales"]}
                                />
                                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r:4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                    <h3 className="font-semibold text-card-foreground mb-6">Payment Methods</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reportData.paymentMethodStats}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {reportData.paymentMethodStats.map((_:any, index:number) => (
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
                <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                    <h3 className="font-semibold text-card-foreground mb-6">Revenue by Category</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData.categoryStats.slice(0, 5)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="_id" tick={{fontSize: 11}} stroke="hsl(var(--muted-foreground))" />
                                <YAxis tick={{fontSize: 11}} stroke="hsl(var(--muted-foreground))" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    formatter={(val: number) => [`₹${val.toLocaleString()}`, "Revenue"]}
                                />
                                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                    <h3 className="font-semibold text-card-foreground mb-6">Top Vendors by Revenue</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData.vendorRevenue.slice(0, 5)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                <XAxis type="number" tick={{fontSize: 11}} stroke="hsl(var(--muted-foreground))" />
                                <YAxis dataKey="_id" type="category" tick={{fontSize: 10}} stroke="hsl(var(--muted-foreground))" width={80} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    formatter={(val: number) => [`₹${val.toLocaleString()}`, "Revenue"]}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--secondary-foreground))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkReportsDashboard;
