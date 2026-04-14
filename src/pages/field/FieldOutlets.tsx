import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import { fieldConfig } from "@/config/fieldConfig";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Loader2, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const FieldOutlets = () => {
  const { data: outlets, isLoading, error } = useQuery({
    queryKey: ["executiveOutlets"],
    queryFn: async () => {
      const { data } = await api.get("/outlets/executive");
      return data;
    },
  });

  const handleGetDirections = (outlet: any) => {
    if (outlet.geoLocation?.coordinates) {
      const [lng, lat] = outlet.geoLocation.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    } else {
      const addr = `${outlet.address.street}, ${outlet.address.city}, ${outlet.address.state}`;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, "_blank");
    }
  };

  return (
    <DashboardLayout role={fieldConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Outlets</h1>
            <p className="text-sm text-muted-foreground">Manage and track your assigned retail outlets</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus size={16} /> Add Outlet
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Error loading outlets.</div>
        ) : (
          <DataTable
            columns={[
              { header: "Outlet", accessor: (o: any) => o.name },
              { header: "Address", accessor: (o: any) => `${o.address.street}, ${o.address.city}` },
              { header: "Contact", accessor: (o: any) => (
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-muted-foreground" />
                  <span>{o.phone}</span>
                </div>
              )},
              { header: "Total Orders", accessor: (o: any) => o.totalOrders || 0 },
              { header: "Actions", accessor: (o: any) => (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 text-primary hover:text-primary hover:bg-primary/5 border-primary/20"
                  onClick={() => handleGetDirections(o)}
                >
                  <MapPin size={14} />
                  Get Directions
                </Button>
              )},
            ]}
            data={outlets || []}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default FieldOutlets;
