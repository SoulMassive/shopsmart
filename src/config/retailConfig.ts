import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  User,
} from "lucide-react";
import type { RoleConfig } from "@/components/dashboard/DashboardSidebar";

export const retailConfig: RoleConfig = {
  title: "Retail Outlet",
  basePath: "/retail",
  items: [
    { title: "Dashboard", url: "/retail", icon: LayoutDashboard },
    { title: "Products", url: "/retail/products", icon: Package },
    { title: "Place Order", url: "/retail/order", icon: ShoppingCart },
    { title: "Order History", url: "/retail/orders", icon: ClipboardList },
    { title: "Profile", url: "/retail/profile", icon: User },
  ],
};
