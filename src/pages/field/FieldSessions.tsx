import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import { fieldConfig } from "@/config/fieldConfig";

const sessions = [
  { id: "S001", date: "2026-03-04", start: "09:15 AM", end: "05:35 PM", hours: "8h 20m", distance: "24.5 km", outlets: 8 },
  { id: "S002", date: "2026-03-03", start: "09:00 AM", end: "04:45 PM", hours: "7h 45m", distance: "21.2 km", outlets: 7 },
  { id: "S003", date: "2026-03-02", start: "09:30 AM", end: "05:00 PM", hours: "7h 30m", distance: "19.8 km", outlets: 6 },
  { id: "S004", date: "2026-03-01", start: "09:10 AM", end: "06:00 PM", hours: "8h 50m", distance: "28.1 km", outlets: 10 },
  { id: "S005", date: "2026-02-28", start: "09:20 AM", end: "04:30 PM", hours: "7h 10m", distance: "17.5 km", outlets: 5 },
];

const FieldSessions = () => (
  <DashboardLayout role={fieldConfig}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Work Sessions</h1>
        <p className="text-sm text-muted-foreground">Your daily work session history</p>
      </div>

      <DataTable
        columns={[
          { header: "Date", accessor: "date" },
          { header: "Start", accessor: "start" },
          { header: "End", accessor: "end" },
          { header: "Duration", accessor: "hours" },
          { header: "Distance", accessor: "distance" },
          { header: "Outlets", accessor: (row) => String(row.outlets) },
        ]}
        data={sessions}
      />
    </div>
  </DashboardLayout>
);

export default FieldSessions;
