import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { GeoMap } from "@/components/custom/GeoMap";
import {
    ArrowLeft,
    User,
    Store,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Loader2,
    AlertCircle,
} from "lucide-react";

// ── Reusable sub-components ──────────────────────────────────────────────────

const InfoRow = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
        <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
            <span className="text-sm text-muted-foreground shrink-0 w-32">{label}</span>
            <span className="text-sm font-medium text-card-foreground text-right">{value}</span>
        </div>
    ) : null;

const Section = ({
    icon: Icon,
    title,
    children,
}: {
    icon: any;
    title: string;
    children: React.ReactNode;
}) => (
    <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
        <div>{children}</div>
    </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const UserProfile = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["adminUserProfile", userId],
        queryFn: async () => {
            const { data } = await api.get(`/admin/users/${userId}`);
            return data;
        },
    });

    return (
        <DashboardLayout role={adminConfig}>
            <div className="max-w-2xl space-y-5">

                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/admin/users")}
                    className="gap-2 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Users
                </Button>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error */}
                {(error || (!isLoading && !profile)) && (
                    <div className="bg-card rounded-2xl border border-destructive/30 p-10 flex flex-col items-center gap-3 text-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="font-semibold">Profile not found</p>
                        <p className="text-sm text-muted-foreground">
                            This user may not exist or has been deleted.
                        </p>
                    </div>
                )}

                {/* Profile content */}
                {profile && (
                    <>
                        {/* Page heading */}
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Outlet Profile</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {profile.shopName
                                    ? `${profile.shopName} · owned by ${profile.fullName}`
                                    : profile.fullName}
                            </p>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex flex-wrap gap-2">
                            {profile.phone && (
                                <a href={`tel:${profile.phone}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Phone className="h-4 w-4 text-green-600" />
                                        Call Outlet
                                    </Button>
                                </a>
                            )}
                            <a href={`mailto:${profile.email}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    Send Email
                                </Button>
                            </a>
                            {profile.location && (
                                <a
                                    href={`https://www.google.com/maps?q=${profile.location.latitude},${profile.location.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <ExternalLink className="h-4 w-4 text-orange-500" />
                                        Google Maps
                                    </Button>
                                </a>
                            )}
                        </div>

                        {/* Owner */}
                        <Section icon={User} title="Owner Information">
                            <InfoRow label="Full Name" value={profile.fullName} />
                            <InfoRow label="Email" value={profile.email} />
                            <InfoRow label="Phone" value={profile.phone} />
                            <div className="flex items-center justify-between gap-4 py-3 border-b border-border/60">
                                <span className="text-sm text-muted-foreground w-32">Role</span>
                                <span className="text-sm font-medium capitalize">{profile.role}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 py-3">
                                <span className="text-sm text-muted-foreground w-32">Status</span>
                                <StatusBadge status={profile.isActive ? "Active" : "Inactive"} />
                            </div>
                        </Section>

                        {/* Shop */}
                        <Section icon={Store} title="Shop Information">
                            <InfoRow label="Shop Name" value={profile.shopName} />
                            <InfoRow label="GST Number" value={profile.gstNumber} />
                            <InfoRow label="Outlet Status" value={profile.outletStatus} />
                            <div className="flex items-center justify-between gap-4 py-3">
                                <span className="text-sm text-muted-foreground w-32">Registered</span>
                                <span className="text-sm font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </Section>

                        {/* Address */}
                        {profile.address && (
                            <Section icon={MapPin} title="Address">
                                <InfoRow label="Street" value={profile.address.street} />
                                <InfoRow label="City" value={profile.address.city} />
                                <InfoRow label="State" value={profile.address.state} />
                                <InfoRow label="Zip Code" value={profile.address.zipCode} />
                                <InfoRow label="Country" value={profile.address.country} />
                            </Section>
                        )}

                        {/* Map */}
                        {profile.location ? (
                            <Section icon={MapPin} title="Shop Location">
                                <p className="text-xs text-muted-foreground font-mono mb-3">
                                    {profile.location.latitude.toFixed(5)},{" "}
                                    {profile.location.longitude.toFixed(5)}
                                </p>
                                <div className="rounded-xl overflow-hidden">
                                    <GeoMap
                                        latitude={profile.location.latitude}
                                        longitude={profile.location.longitude}
                                        shopName={profile.shopName}
                                    />
                                </div>
                            </Section>
                        ) : (
                            <div className="bg-card rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">
                                <MapPin className="h-6 w-6 mx-auto mb-2 opacity-30" />
                                No geolocation data recorded for this outlet.
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserProfile;
