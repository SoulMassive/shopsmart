import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

const ExecutiveCharts = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["executiveData"],
        queryFn: async () => {
            const { data } = await api.get("/admin/analytics/executives");
            return data;
        },
    });

    if (isLoading) {
        return <div className="w-full h-[320px] flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }

    const executives = data?.executives || [];

    // Sort by orders delivered to highlight top performers
    const sortedExecs = [...executives].sort((a, b) => b.orders - a.orders).slice(0, 10);
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedExecs} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        stroke="hsl(var(--muted-foreground))"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="orders" name="Orders Delivered" radius={[4, 4, 0, 0]}>
                        {sortedExecs.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExecutiveCharts;
