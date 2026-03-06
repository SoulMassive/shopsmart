import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import { fieldConfig } from "@/config/fieldConfig";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const outlets = [
  { id: "O001", name: "Fresh Mart", owner: "Anil Sharma", phone: "+91 98765 43210", category: "Grocery", added: "2026-02-15" },
  { id: "O002", name: "QuickStop", owner: "Meera Reddy", phone: "+91 87654 32109", category: "Convenience", added: "2026-02-20" },
  { id: "O003", name: "Green Grocers", owner: "Suresh Gupta", phone: "+91 76543 21098", category: "Organic", added: "2026-03-01" },
  { id: "O004", name: "Metro Store", owner: "Kiran Das", phone: "+91 65432 10987", category: "Supermarket", added: "2026-03-03" },
];

const FieldOutlets = () => (
  <DashboardLayout role={fieldConfig}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Outlets</h1>
          <p className="text-sm text-muted-foreground">Manage and add new retail outlets</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus size={16} /> Add Outlet
        </Button>
      </div>

      <DataTable
        columns={[
          { header: "Outlet", accessor: "name" },
          { header: "Owner", accessor: "owner" },
          { header: "Phone", accessor: "phone" },
          { header: "Category", accessor: "category" },
          { header: "Added", accessor: "added" },
        ]}
        data={outlets}
      />
    </div>
  </DashboardLayout>
);

export default FieldOutlets;
