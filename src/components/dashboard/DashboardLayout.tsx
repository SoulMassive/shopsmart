import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar, type RoleConfig } from "./DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface DashboardLayoutProps {
  children: ReactNode;
  role: RoleConfig;
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { totalItems } = useCart(); // CartProvider wraps the full app, safe to call here

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 gap-3 bg-card">
            <SidebarTrigger className="shrink-0" />
            <h2 className="text-sm font-semibold text-foreground truncate flex-1">{role.title}</h2>

            {/* Cart icon — routes to role-appropriate cart */}
            <button
              onClick={() => navigate(role.basePath === "/admin" ? "/admin/cart" : "/retail/cart")}
              className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
