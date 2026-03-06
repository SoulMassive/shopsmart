import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ── Fix: Vite breaks Leaflet's default marker image resolution
//    by clearing the internal URL resolver and pointing to CDN assets.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface GeoMapProps {
    latitude: number;
    longitude: number;
    shopName?: string;
}

// NOTE: MapContainer must ONLY receive a stable `center` prop on first render.
// To "fly" to a new location we rely on the `key` trick:
// changing the key forces a full remount of MapContainer with the new center.
export function GeoMap({ latitude, longitude, shopName }: GeoMapProps) {
    // Guard: never render with null or out-of-range coordinates
    if (
        latitude === null ||
        longitude === null ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180
    ) {
        return null;
    }

    return (
        <MapContainer
            // key forces a clean remount whenever coordinates change
            key={`${latitude.toFixed(5)},${longitude.toFixed(5)}`}
            center={[latitude, longitude]}
            zoom={16}
            scrollWheelZoom={false}
            style={{
                height: "250px",
                width: "100%",
                borderRadius: "12px",
                zIndex: 1,
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
                <Popup>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>
                        📍 {shopName || "Your Shop Location"}
                        <br />
                        <span style={{ color: "#6b7280", fontSize: "11px" }}>
                            {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
