import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const AdminProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.products;
    },
  });

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
            <p className="text-sm text-muted-foreground">Manage brands, products, and pricing</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Error loading products. Please try again.
          </div>
        ) : (
          <DataTable
            columns={[
              { header: "Product", accessor: "name" },
              { header: "Brand", accessor: (row: any) => row.category }, // backend uses category for SRR etc
              { header: "Price", accessor: (row: any) => `₹${row.price}` },
              { header: "Stock", accessor: (row: any) => String(row.stock) },
              { header: "Status", accessor: (row: any) => <StatusBadge status={row.isActive ? "Active" : "Inactive"} /> },
            ]}
            data={data || []}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminProducts;
