import {
  LayoutDashboard,
  Store,
  MapPin,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { RoleConfig } from "@/components/dashboard/DashboardSidebar";

export const fieldConfig: RoleConfig = {
  title: "Field Executive",
  basePath: "/field",
  items: [
    { title: "Dashboard", url: "/field", icon: LayoutDashboard },
    { title: "Outlets", url: "/field/outlets", icon: Store },
    { title: "Tracking", url: "/field/tracking", icon: MapPin },
    { title: "Performance", url: "/field/performance", icon: TrendingUp },
    { title: "Sessions", url: "/field/sessions", icon: Clock },
  ],
};
