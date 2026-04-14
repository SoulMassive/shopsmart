import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import { MapPin, Navigation, Loader2, Phone, Clock, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminTracking = () => {
    const { data: logs, isLoading, error } = useQuery({
        queryKey: ["adminTracking"],
        queryFn: async () => {
            const { data } = await api.get("/admin/analytics/tracking");
            return data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const handleViewOnMap = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    };

    return (
        <DashboardLayout role={adminConfig}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">GPS Monitoring</h1>
                        <p className="text-sm text-muted-foreground">Track field executive locations in real-time</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map placeholder */}
                    <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                        <div className="h-[600px] flex items-center justify-center bg-muted/20 relative">
                            <div className="text-center p-8">
                                <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-foreground">Real-time Visualization</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[300px] mx-auto">
                                    Agent positions are updated live. In production, this area uses OpenStreetMaps or Google Maps to show all breadcrumbs.
                                </p>
                            </div>
                            
                            {/* Visual indicator of active agents */}
                            {!isLoading && logs?.map((agent: any, i: number) => (
                                <div 
                                    key={agent.executiveId}
                                    className="absolute h-4 w-4 rounded-full bg-primary animate-pulse border-2 border-card shadow-lg"
                                    style={{ 
                                        top: `${20 + (i * 15) % 60}%`, 
                                        left: `${15 + (i * 25) % 70}%` 
                                    }}
                                    title={agent.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Executive list */}
                    <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col max-h-[600px]">
                        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                            <h3 className="font-semibold text-card-foreground">Online Executives</h3>
                            {isLoading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {error ? (
                                <p className="text-center text-sm text-destructive">Failed to load tracking data.</p>
                            ) : logs?.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-10">No agents currently active.</p>
                            ) : (
                                logs?.map((agent: any) => (
                                    <div key={agent.executiveId} className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all space-y-3 shadow-sm group">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-sm text-card-foreground">{agent.name}</p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Clock size={10} />
                                                    Updated {new Date(agent.lastUpdate).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className={`h-2.5 w-2.5 rounded-full ${agent.status === 'Traveling' ? 'bg-blue-500' : agent.status === 'At Outlet' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Navigation size={12} className="text-primary" />
                                                {agent.status}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Phone size={12} className="text-primary" />
                                                {agent.phone || "—"}
                                            </span>
                                        </div>

                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="w-full text-[10px] h-8 gap-2"
                                            onClick={() => handleViewOnMap(agent.latitude, agent.longitude)}
                                        >
                                            <ExternalLink size={12} />
                                            View Real-time Position
                                        </Button>
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

export default AdminTracking;
