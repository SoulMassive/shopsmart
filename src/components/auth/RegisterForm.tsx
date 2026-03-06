import React, { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/custom/InputField";
import { PhoneInput } from "@/components/custom/PhoneInput";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { toast } from "sonner";
import { Store, Leaf, MapPin, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

// Lazy-load the map — Leaflet manipulates the DOM and cannot run during SSR/hydration
const GeoMap = lazy(() =>
    import("@/components/custom/GeoMap").then((m) => ({ default: m.GeoMap }))
);

export function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        shopName: "",
        gstNumber: "",
        password: "",
        streetAddress: "",
        cityState: "",
        zipCode: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Geolocation hook
    const geo = useGeolocation();
    const hasLocation = geo.latitude !== null && geo.longitude !== null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors((prev) => {
                const n = { ...prev };
                delete n[id];
                return n;
            });
        }
    };

    const handlePhoneChange = (value: string) => {
        setFormData((prev) => ({ ...prev, contactNumber: value }));
        if (errors.contactNumber) {
            setErrors((prev) => {
                const n = { ...prev };
                delete n.contactNumber;
                return n;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
        if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
        if (!formData.cityState.trim()) newErrors.cityState = "City & State is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly.");
            return;
        }

        setIsLoading(true);
        try {
            const payload: Record<string, any> = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.contactNumber,
                shopName: formData.shopName,
                gstNumber: formData.gstNumber,
                address: {
                    street: formData.streetAddress,
                    cityState: formData.cityState,
                    zipCode: formData.zipCode,
                },
            };

            // Attach GeoJSON location if the user detected their position
            if (hasLocation) {
                // MongoDB GeoJSON stores coordinates as [longitude, latitude]
                payload.location = {
                    type: "Point",
                    coordinates: [geo.longitude!, geo.latitude!],
                };
            }

            const { data } = await api.post("/auth/register", payload);
            login(data.token, data);
            toast.success("Account created successfully! Welcome to ShopsMart.");
            navigate("/retail");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full relative">
            <div className="absolute -top-4 -left-4 text-green-200 opacity-50 hidden md:block">
                <Leaf size={48} />
            </div>
            <div className="absolute -top-4 -right-4 text-green-200 opacity-50 hidden md:block">
                <Store size={48} />
            </div>

            {/* Header */}
            <div className="text-center mb-5 relative z-10">
                <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                        <Store className="text-white w-8 h-8" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Outlet Registration</h1>
                <p className="text-gray-500 text-sm mt-2">Get started with the ShopsMart Seller Portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="fullName" label="Full Name" placeholder="John Doe" value={formData.fullName} onChange={handleChange} error={errors.fullName} disabled={isLoading} />
                    <InputField id="email" type="email" label="Email" placeholder="name@example.com" value={formData.email} onChange={handleChange} error={errors.email} disabled={isLoading} />
                </div>

                {/* Row 2: Phone + Shop Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PhoneInput id="contactNumber" label="Contact Number" placeholder="9876543210" value={formData.contactNumber} onPhoneChange={handlePhoneChange} onChange={handleChange} error={errors.contactNumber} disabled={isLoading} type="tel" />
                    <InputField id="shopName" label="Shop Name" placeholder="e.g., BestMart" value={formData.shopName} onChange={handleChange} error={errors.shopName} disabled={isLoading} />
                </div>

                {/* Row 3: GST + Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="gstNumber" label="GST Number (Optional)" placeholder="Enter 15-digit GSTIN" value={formData.gstNumber} onChange={handleChange} disabled={isLoading} />
                    <PasswordInput id="password" label="Password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} disabled={isLoading} />
                </div>

                {/* Shop Address */}
                <div className="pt-0">
                    <h3 className="text-gray-800 font-semibold mb-2 border-b pb-1 text-sm">Shop Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField id="streetAddress" label="Street Address" placeholder="123 Main St" value={formData.streetAddress} onChange={handleChange} error={errors.streetAddress} disabled={isLoading} />
                        <InputField id="cityState" label="City & State" placeholder="Bangalore, Karnataka" value={formData.cityState} onChange={handleChange} error={errors.cityState} disabled={isLoading} />
                        <InputField id="zipCode" label="Zip Code" placeholder="560001" value={formData.zipCode} onChange={handleChange} error={errors.zipCode} disabled={isLoading} />
                    </div>
                </div>

                {/* ── GEOLOCATION SECTION ───────────────────────────────────────── */}
                <div className="pt-0">
                    <h3 className="text-gray-800 font-semibold mb-2 border-b pb-1 text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-green-600" />
                        Shop Location (GeoTag)
                        <span className="text-xs text-gray-400 font-normal ml-1">• Optional but recommended</span>
                    </h3>

                    {/* Detect button */}
                    <button
                        type="button"
                        onClick={geo.detect}
                        disabled={geo.loading || isLoading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm
              ${hasLocation
                                ? "bg-green-50 text-green-700 border border-green-300 hover:bg-green-100"
                                : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-[1.02]"
                            }
              disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {geo.loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : hasLocation ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <MapPin size={16} />
                        )}
                        {geo.loading ? "Detecting location..." : hasLocation ? "Location Detected — Re-detect" : "📍 Detect My Shop Location"}
                    </button>

                    {/* Error message */}
                    {geo.error && (
                        <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{geo.error}</span>
                        </div>
                    )}

                    {/* Coordinates display + Map preview */}
                    {hasLocation && (
                        <div className="mt-3 space-y-3">
                            {/* Coordinate read-only pills */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Latitude</label>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono text-gray-700">
                                        <MapPin size={12} className="text-green-500 shrink-0" />
                                        {geo.latitude!.toFixed(6)}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Longitude</label>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono text-gray-700">
                                        <MapPin size={12} className="text-blue-500 shrink-0" />
                                        {geo.longitude!.toFixed(6)}
                                    </div>
                                </div>
                            </div>
                            {geo.accuracy && (
                                <p className="text-xs text-gray-400">
                                    📡 Accuracy: ±{Math.round(geo.accuracy)} meters
                                </p>
                            )}

                            {/* Leaflet map preview */}
                            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <Suspense
                                    fallback={
                                        <div className="h-[250px] bg-gray-100 flex items-center justify-center rounded-xl">
                                            <Loader2 size={24} className="animate-spin text-green-500" />
                                        </div>
                                    }
                                >
                                    <GeoMap
                                        latitude={geo.latitude!}
                                        longitude={geo.longitude!}
                                        shopName={formData.shopName}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    )}
                </div>
                {/* ────────────────────────────────────────────────────────────── */}

                <Button
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-3 text-base font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-green-700 hover:to-green-800 transition-all duration-300"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Registering Outlet..." : "Register"}
                </Button>
            </form>
        </div>
    );
}
