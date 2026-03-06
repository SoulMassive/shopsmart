import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import { MapPin, Navigation } from "lucide-react";

const executives = [
  { name: "Rajesh Kumar", territory: "North Delhi", distance: "24.5 km", outlets: 8, lastSeen: "10 min ago" },
  { name: "Priya Sharma", territory: "South Mumbai", distance: "18.2 km", outlets: 6, lastSeen: "5 min ago" },
  { name: "Sunita Verma", territory: "West Pune", distance: "12.8 km", outlets: 4, lastSeen: "22 min ago" },
];

const AdminTracking = () => (
  <DashboardLayout role={adminConfig}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">GPS Monitoring</h1>
        <p className="text-sm text-muted-foreground">Track field executive locations in real-time</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map placeholder */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="h-[500px] flex items-center justify-center bg-muted/30 relative">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Google Maps Integration</p>
              <p className="text-xs text-muted-foreground mt-1">Real-time executive tracking will appear here</p>
            </div>
            {/* Simulated map pins */}
            <div className="absolute top-1/4 left-1/3 h-4 w-4 rounded-full bg-primary animate-glow-pulse" />
            <div className="absolute top-1/2 right-1/3 h-4 w-4 rounded-full bg-accent animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-1/3 left-1/2 h-4 w-4 rounded-full bg-primary animate-glow-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        {/* Executive list */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
          <h3 className="font-semibold text-card-foreground">Active Executives</h3>
          {executives.map((exec) => (
            <div key={exec.name} className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-card-foreground">{exec.name}</p>
                <span className="text-xs text-muted-foreground">{exec.lastSeen}</span>
              </div>
              <p className="text-xs text-muted-foreground">{exec.territory}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-primary">
                  <Navigation className="h-3 w-3" /> {exec.distance}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {exec.outlets} outlets
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminTracking;
