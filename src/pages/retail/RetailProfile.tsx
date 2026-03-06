import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { retailConfig } from "@/config/retailConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Save, User, Store } from "lucide-react";
import { toast } from "sonner";

const RetailProfile = () => {
  const { user } = useAuth();

  // Fetch the outlet linked to this user
  const { data: outlet, isLoading } = useQuery({
    queryKey: ["myOutlet"],
    queryFn: async () => {
      const { data } = await api.get("/outlets/mine");
      return data;
    },
    // Don't crash if the endpoint isn't ready yet
    retry: false,
  });

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    phone: "",
    shopName: "",
    streetAddress: "",
    cityState: "",
    zipCode: "",
    gstNumber: "",
  });

  const [saving, setSaving] = useState(false);

  // Pre-fill once data arrives
  useEffect(() => {
    setForm({
      ownerName: user?.name || "",
      email: (user as any)?.email || "",
      phone: (user as any)?.phone || outlet?.phone || "",
      shopName: outlet?.name || "",
      streetAddress: outlet?.address?.street || "",
      cityState:
        outlet?.address
          ? `${outlet.address.city}${outlet.address.state ? ", " + outlet.address.state : ""}`
          : "",
      zipCode: outlet?.address?.zipCode || "",
      gstNumber: outlet?.gstNumber || "",
    });
  }, [user, outlet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update user name if changed
      await api.patch("/auth/me", { name: form.ownerName });
      // Update outlet details if outlet exists
      if (outlet?._id) {
        const [city = "", state = ""] = form.cityState.split(",").map((s) => s.trim());
        await api.patch(`/outlets/${outlet._id}`, {
          name: form.shopName,
          phone: form.phone,
          gstNumber: form.gstNumber,
          address: {
            street: form.streetAddress,
            city,
            state,
            zipCode: form.zipCode,
          },
        });
      }
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const field = (id: keyof typeof form, label: string, placeholder = "", readOnly = false) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={form[id]}
        onChange={handleChange}
        placeholder={placeholder || label}
        readOnly={readOnly}
        className={readOnly ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
      />
    </div>
  );

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6 max-w-xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Outlet Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your outlet information</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* ── Account Info ─────────────────────────────── */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Account Details</h2>
              </div>
              {field("ownerName", "Owner Name")}
              {field("email", "Email", "", true /* read-only — must go through password reset flow */)}
            </div>

            {/* ── Shop Info ─────────────────────────────────── */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Store className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Shop Details</h2>
              </div>
              {field("shopName", "Shop Name")}
              {field("phone", "Phone Number")}
              {field("gstNumber", "GST Number (Optional)", "Enter 15-digit GSTIN")}
            </div>

            {/* ── Address ───────────────────────────────────── */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <h2 className="font-semibold text-sm text-foreground">Shop Address</h2>
              {field("streetAddress", "Street Address", "123 Main Street")}
              {field("cityState", "City & State", "Bangalore, Karnataka")}
              {field("zipCode", "Zip Code", "560001")}
            </div>

            <Button onClick={handleSave} disabled={saving} className="gap-2 w-full sm:w-auto">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetailProfile;
