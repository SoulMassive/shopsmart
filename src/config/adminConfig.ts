import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  MapPin,
  BarChart3,
  Database,
  History,
} from "lucide-react";
import type { RoleConfig } from "@/components/dashboard/DashboardSidebar";

export const adminConfig: RoleConfig = {
  title: "Admin Dashboard",
  basePath: "/admin",
  items: [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Bulk Manager", url: "/admin/bulk", icon: Database },
    { title: "Bulk History", url: "/admin/bulk-history", icon: History },
    { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
    { title: "Products", url: "/admin/products", icon: Package },
    { title: "GPS Tracking", url: "/admin/tracking", icon: MapPin },
    { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  ],
};
