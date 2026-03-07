import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Package, RouteIcon, MapPin, Loader2 } from "lucide-react";
import api from "@/lib/api";

// Fix default leaflet marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter: [number, number] = [28.6139, 77.2090]; // New Delhi

const ExecutiveTrackingMap = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["executiveData"],
        queryFn: async () => {
            const { data } = await api.get("/admin/analytics/executives");
            return data;
        },
        // Refetch every 30 seconds for live tracking feel
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[320px] rounded-xl flex items-center justify-center bg-muted/20 border border-border">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading Tracking Data...</span>
            </div>
        );
    }

    const executives = data?.executives || [];

    // Custom colors for routes
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

    return (
        <div className="w-full h-full min-h-[400px] overflow-hidden rounded-xl border border-border shadow-inner relative z-0">
            <MapContainer
                center={executives.length > 0 && executives[0].lastLocation ? executives[0].lastLocation : defaultCenter}
                zoom={12}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {executives.map((exec: any, idx: number) => {
                    if (!exec.lastLocation) return null;
                    const color = colors[idx % colors.length];

                    return (
                        <div key={exec.name}>
                            {/* Route Path */}
                            {exec.route && exec.route.length > 1 && (
                                <Polyline positions={exec.route} pathOptions={{ color, weight: 4, opacity: 0.7 }} />
                            )}

                            {/* Current Location Marker */}
                            <Marker position={exec.lastLocation}>
                                <Popup className="rounded-xl overflow-hidden shadow-lg p-0">
                                    <div className="p-3 bg-white w-[220px]">
                                        <h4 className="font-bold text-base flex border-b pb-2 mb-2 items-center text-foreground">
                                            <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                                            {exec.name}
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center hidden">
                                                <span className="text-muted-foreground flex items-center gap-1"><RouteIcon className="h-3.5 w-3.5" /> Distance:</span>
                                                <span className="font-medium">{exec.distance.toFixed(1)} km</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Visited:</span>
                                                <span className="font-medium">{exec.outlets} Outlets</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Delivered:</span>
                                                <span className="font-medium">{exec.orders} Orders</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2 text-center pt-2 border-t">
                                                Updated: {new Date(exec.lastUpdate).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </div>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default ExecutiveTrackingMap;
