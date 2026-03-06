import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { fieldConfig } from "@/config/fieldConfig";
import { Store, MapPin, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FieldDashboard = () => {
  const [working, setWorking] = useState(false);

  return (
    <DashboardLayout role={fieldConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hello, Rajesh</h1>
            <p className="text-sm text-muted-foreground">Today's field activity summary</p>
          </div>
          <Button
            size="lg"
            variant={working ? "destructive" : "default"}
            onClick={() => setWorking(!working)}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            {working ? "End Work Session" : "Start Work Session"}
          </Button>
        </div>

        {working && (
          <div className="bg-secondary rounded-2xl border border-primary/20 p-4 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-primary animate-glow-pulse" />
            <p className="text-sm font-medium text-secondary-foreground">
              Work session active — GPS tracking enabled
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Outlets Visited" value="8" icon={<Store className="h-5 w-5 text-primary" />} />
          <StatCard title="New Outlets" value="2" change="+2" changeType="up" icon={<MapPin className="h-5 w-5 text-primary" />} />
          <StatCard title="Distance Covered" value="24.5 km" icon={<TrendingUp className="h-5 w-5 text-primary" />} />
          <StatCard title="Working Hours" value="6h 20m" icon={<Clock className="h-5 w-5 text-primary" />} />
        </div>

        {/* Today's route placeholder */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-card-foreground">Today's Route</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <MapPin className="h-10 w-10 text-primary/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Route map will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FieldDashboard;
