import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, AlertTriangle, PackageOpen } from "lucide-react";
import api from "@/lib/api";

const ProductCharts = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["productAnalytics"],
        queryFn: async () => {
            const { data } = await api.get("/admin/analytics/products");
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

    const { topProducts, categoryDistribution, lowStock } = data || { topProducts: [], categoryDistribution: [], lowStock: [] };
    const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {/* Top Selling Products - Bar Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px]">
                <h3 className="font-semibold text-card-foreground mb-4 text-center">Top Selling Products</h3>
                <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                            <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 11 }}
                                width={100}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="units" name="Units Sold" radius={[0, 4, 4, 0]}>
                                {topProducts.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Stock Indicator */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">Low Stock Warning</h3>
                    <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Needs Restock
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {lowStock.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <PackageOpen className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">All products are sufficiently stocked.</p>
                        </div>
                    ) : (
                        lowStock.map((product: any) => (
                            <div key={product.id} className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-sm text-foreground">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${product.stock < 10 ? 'text-destructive' : 'text-orange-500'}`}>
                                        {product.stock} left
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Category Distribution - Pie Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card min-h-[350px]">
                <h3 className="font-semibold text-card-foreground mb-4 text-center">Category Sales Distribution</h3>
                <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {categoryDistribution.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip formatter={(value: number) => [`${value} Units`, "Sold"]} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProductCharts;
