import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BrandThemeProvider } from "./context/BrandThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTracking from "./pages/admin/AdminTracking";
import AdminReports from "./pages/admin/AdminReports";
import UserProfile from "./pages/admin/UserProfile";

// Retail pages
import RetailDashboard from "./pages/retail/RetailDashboard";
import RetailProducts from "./pages/retail/RetailProducts";
import RetailOrder from "./pages/retail/RetailOrder";
import RetailOrderHistory from "./pages/retail/RetailOrderHistory";
import RetailProfile from "./pages/retail/RetailProfile";
import Cart from "./pages/retail/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <BrandThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Public category pages with dynamic theming */}
                <Route path="/category/:brand" element={<CategoryPage />} />

                {/* Admin */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Routes>
                        <Route index element={<AdminOverview />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="users/:userId" element={<UserProfile />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="tracking" element={<AdminTracking />} />
                        <Route path="reports" element={<AdminReports />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                {/* Retail Outlet */}
                <Route
                  path="/retail/*"
                  element={
                    <ProtectedRoute>
                      <Routes>
                        <Route index element={<RetailDashboard />} />
                        <Route path="products" element={<RetailProducts />} />
                        <Route path="order" element={<RetailOrder />} />
                        <Route path="orders" element={<RetailOrderHistory />} />
                        <Route path="profile" element={<RetailProfile />} />
                        <Route path="cart" element={<Cart />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BrandThemeProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
