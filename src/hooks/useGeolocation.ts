import { useCallback, useState } from "react";

export type GeoState = {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
};

export function useGeolocation() {
    const [state, setState] = useState<GeoState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: false,
    });

    const detect = useCallback(() => {
        if (!navigator.geolocation) {
            setState((s) => ({
                ...s,
                error: "Geolocation is not supported by your browser.",
            }));
            return;
        }

        setState((s) => ({ ...s, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    error: null,
                    loading: false,
                });
            },
            (err) => {
                let message = "Failed to get your location.";
                if (err.code === err.PERMISSION_DENIED)
                    message = "Location permission was denied. Please allow access in your browser settings.";
                else if (err.code === err.POSITION_UNAVAILABLE)
                    message = "Location information is unavailable. Please try again.";
                else if (err.code === err.TIMEOUT)
                    message = "Location request timed out. Please try again.";

                setState({ latitude: null, longitude: null, accuracy: null, error: message, loading: false });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    const clear = useCallback(() => {
        setState({ latitude: null, longitude: null, accuracy: null, error: null, loading: false });
    }, []);

    return { ...state, detect, clear };
}
