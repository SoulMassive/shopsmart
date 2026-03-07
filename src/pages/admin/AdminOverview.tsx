import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import BusinessOverview from "@/components/admin/analytics/BusinessOverview";
import CsvUploadModal from "@/components/admin/analytics/CsvUploadModal";
import ExecutiveTrackingMap from "@/components/admin/analytics/ExecutiveTrackingMap";
import ExecutiveCharts from "@/components/admin/analytics/ExecutiveCharts";
import RevenueCharts from "@/components/admin/analytics/RevenueCharts";
import ProductCharts from "@/components/admin/analytics/ProductCharts";
import { Button } from "@/components/ui/button";
import { Download, UploadCloud, Calendar } from "lucide-react";

const AdminOverview = () => {
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">
        {/* CSV Upload Modal */}
        <CsvUploadModal open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen} />

        {/* Header & Reports/Upload System */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Advanced Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">Comprehensive insights into logistics, sales, and field executives</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" /> Last 30 Days
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={() => setIsCsvModalOpen(true)}
            >
              <UploadCloud className="h-4 w-4" /> Upload CSV Data
            </Button>
          </div>
        </div>

        {/* 1. Business Overview KPIs */}
        <BusinessOverview />

        {/* 2. Map & Executive Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card min-h-[400px]">
            <h3 className="font-semibold text-card-foreground mb-4">Live Executive Tracking Map</h3>
            <div className="w-full h-[360px] rounded-xl overflow-hidden border border-border">
              <ExecutiveTrackingMap />
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5 shadow-card min-h-[400px]">
            <h3 className="font-semibold text-card-foreground mb-4">Executive Performance</h3>
            <div className="w-full">
              <ExecutiveCharts />
            </div>
          </div>
        </div>

        {/* 3. Sales & Revenue Analytics */}
        <div className="w-full">
          <RevenueCharts />
        </div>

        {/* 4. Product Analytics */}
        <div className="w-full">
          <ProductCharts />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminOverview;
