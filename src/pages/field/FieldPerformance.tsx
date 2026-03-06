import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { fieldConfig } from "@/config/fieldConfig";
import { Store, MapPin, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", outlets: 8, distance: 22 },
  { day: "Tue", outlets: 6, distance: 18 },
  { day: "Wed", outlets: 10, distance: 28 },
  { day: "Thu", outlets: 7, distance: 20 },
  { day: "Fri", outlets: 9, distance: 25 },
  { day: "Sat", outlets: 5, distance: 14 },
];

const FieldPerformance = () => (
  <DashboardLayout role={fieldConfig}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground">Your activity metrics and monthly summary</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Outlets" value="142" change="+18%" changeType="up" icon={<Store className="h-5 w-5 text-primary" />} />
        <StatCard title="New Outlets Added" value="28" change="+8" changeType="up" icon={<MapPin className="h-5 w-5 text-primary" />} />
        <StatCard title="Total Distance" value="485 km" icon={<TrendingUp className="h-5 w-5 text-primary" />} />
        <StatCard title="Avg Working Hours" value="7h 15m" icon={<Clock className="h-5 w-5 text-primary" />} />
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
        <h3 className="font-semibold text-card-foreground mb-4">This Week's Activity</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="outlets" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Outlets" />
            <Bar dataKey="distance" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} name="Distance (km)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </DashboardLayout>
);

export default FieldPerformance;
