import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { fieldConfig } from "@/config/fieldConfig";
import { MapPin } from "lucide-react";

const FieldTracking = () => (
  <DashboardLayout role={fieldConfig}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Tracking</h1>
        <p className="text-sm text-muted-foreground">Your real-time location and visited outlets</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="h-[500px] flex items-center justify-center bg-muted/30 relative">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Google Maps Integration</p>
            <p className="text-xs text-muted-foreground mt-1">Your live location and route will appear here</p>
          </div>
          {/* Simulated location */}
          <div className="absolute top-1/3 left-1/2 h-5 w-5 rounded-full bg-primary animate-glow-pulse border-2 border-card" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Current Speed", value: "—" },
          { label: "Distance Today", value: "24.5 km" },
          { label: "Outlets Nearby", value: "3" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 shadow-card text-center">
            <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default FieldTracking;
