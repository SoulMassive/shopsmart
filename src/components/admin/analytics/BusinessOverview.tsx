import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Package, Users, Store, Receipt, IndianRupee } from "lucide-react";
import api from "@/lib/api";

const KpiCard = ({ title, value, icon: Icon, trend, colorClass }: any) => (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" /> {trend}
                </span>
            )}
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
        </div>
    </div>
);

const BusinessOverview = () => {
    // We'll wire this up to a real endpoint next, 
    // but for now let's use placeholder data or fetch basics.
    const { data: stats } = useQuery({
        queryKey: ["adminStats"],
        queryFn: async () => {
            // We will create this backend route shortly
            try {
                const { data } = await api.get("/admin/analytics/overview");
                return data;
            } catch (e) {
                return null; // Fallback gracefully if endpoint isn't ready
            }
        },
    });

    // Fallback defaults if API not ready
    const safeStats = stats || {
        revenue: "₹72.4L",
        orders: "4,280",
        invoices: "3,940",
        executives: "48",
        outlets: "230",
        products: "120",
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <KpiCard
                title="Total Revenue"
                value={safeStats.revenue}
                icon={IndianRupee}
                trend="+14.2%"
                colorClass="bg-green-100 text-green-600"
            />
            <KpiCard
                title="Total Orders"
                value={safeStats.orders}
                icon={Package}
                trend="+8.1%"
                colorClass="bg-blue-100 text-blue-600"
            />
            <KpiCard
                title="Invoices Generated"
                value={safeStats.invoices}
                icon={Receipt}
                trend="+12.5%"
                colorClass="bg-purple-100 text-purple-600"
            />
            <KpiCard
                title="Active Executives"
                value={safeStats.executives}
                icon={Users}
                colorClass="bg-orange-100 text-orange-600"
            />
            <KpiCard
                title="Retail Outlets"
                value={safeStats.outlets}
                icon={Store}
                trend="+4.3%"
                colorClass="bg-pink-100 text-pink-600"
            />
            <KpiCard
                title="Products Listed"
                value={safeStats.products}
                icon={Package}
                colorClass="bg-emerald-100 text-emerald-600"
            />
        </div>
    );
};

export default BusinessOverview;
