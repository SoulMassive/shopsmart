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
import ProductDetailPage from "./pages/ProductDetailPage";

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
import AdminCart from "./pages/admin/AdminCart";
import AdminBulkData from "./pages/admin/AdminBulkData";
import AdminBulkHistory from "./pages/admin/AdminBulkHistory";

// Retail pages
import RetailDashboard from "./pages/retail/RetailDashboard";
import RetailProducts from "./pages/retail/RetailProducts";
import RetailOrder from "./pages/retail/RetailOrder";
import RetailOrderHistory from "./pages/retail/RetailOrderHistory";
import RetailProfile from "./pages/retail/RetailProfile";
import Cart from "./pages/retail/Cart";

// Field pages
import FieldDashboard from "./pages/field/FieldDashboard";
import FieldOutlets from "./pages/field/FieldOutlets";
import FieldTracking from "./pages/field/FieldTracking";
import FieldPerformance from "./pages/field/FieldPerformance";
import FieldSessions from "./pages/field/FieldSessions";
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

                {/* Public category & product detail pages */}
                <Route path="/category/:brand" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />

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
                        <Route path="bulk" element={<AdminBulkData />} />
                        <Route path="bulk-history" element={<AdminBulkHistory />} />
                        <Route path="tracking" element={<AdminTracking />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="cart" element={<AdminCart />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                {/* Retail Outlet */}
                <Route
                  path="/retail/*"
                  element={
                    <ProtectedRoute requiredRole="retailOutlet">
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
                {/* Field Executive */}
                <Route
                  path="/field/*"
                  element={
                    <ProtectedRoute requiredRole="executive">
                      <Routes>
                        <Route index element={<FieldDashboard />} />
                        <Route path="outlets" element={<FieldOutlets />} />
                        <Route path="tracking" element={<FieldTracking />} />
                        <Route path="performance" element={<FieldPerformance />} />
                        <Route path="sessions" element={<FieldSessions />} />
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
