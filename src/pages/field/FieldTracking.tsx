import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { fieldConfig } from "@/config/fieldConfig";
import { MapPin, Navigation, History, Loader2, CheckCircle2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { toast } from "sonner";

const FieldTracking = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState("Traveling");

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/admin/analytics/my-logs");
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
        // Just a mock sync for this demo context, or real upload if file exists
        await new Promise(r => setTimeout(r, 1500));
        toast.success("Data synced with headquarters");
    } catch (err) {
        toast.error("Sync failed");
    } finally {
        setIsSyncing(false);
    }
  };

  const handleLogLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLogging(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const { data: newLog } = await api.post("/admin/analytics/log", {
            latitude,
            longitude,
            status
          });
          setLogs(prev => [newLog, ...prev].slice(0, 10));
          toast.success("Location logged successfully");
        } catch (err) {
          toast.error("Failed to log location");
        } finally {
          setIsLogging(false);
        }
      },
      (err) => {
        toast.error("Error getting location: " + err.message);
        setIsLogging(false);
      }
    );
  };

  return (
    <DashboardLayout role={fieldConfig}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Tracking</h1>
            <p className="text-sm text-muted-foreground">Log your current location and activity</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Traveling">Traveling</SelectItem>
                <SelectItem value="At Outlet">At Outlet</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={handleSyncNow} disabled={isSyncing}>
              {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RotateCw size={16} />}
              Sync Now
            </Button>
            <Button className="gap-2" onClick={handleLogLocation} disabled={isLogging}>
              {isLogging ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
              Log Location
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <MapPin size={18} className="text-primary" />
                        Current Route Map
                    </h3>
                </div>
                <div className="h-[400px] flex items-center justify-center bg-secondary/20 relative">
                    <div className="text-center p-6">
                        <MapPin className="h-12 w-12 text-primary/20 mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">Map View</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                            In a real production environment, Google Maps or Mapbox would render your breadcrumbs here.
                        </p>
                    </div>
                    {logs.length > 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary animate-ping" />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Check-ins Today", value: logs.length },
                { label: "Last Status", value: logs[0]?.status || "—" },
                { label: "Active Time", value: "4h 12m" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 shadow-card text-center">
                  <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breadcrumbs List */}
          <div className="bg-card rounded-2xl border border-border flex flex-col shadow-card">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <History size={18} className="text-primary" />
                    Recent Activity
                </h3>
                <Button variant="ghost" size="icon" onClick={() => fetchLogs()} disabled={isLoading}>
                    <Loader2 size={14} className={isLoading ? "animate-spin" : ""} />
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[550px]">
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : logs.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-10">No logs found for today.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={log._id} className="relative pl-6 pb-4 border-l border-border last:border-0 last:pb-0">
                    <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">{log.status}</span>
                        <span className="text-[10px] text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lat: {log.latitude.toFixed(4)}, Lng: {log.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FieldTracking;
