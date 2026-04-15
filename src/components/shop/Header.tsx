import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useBrandTheme } from "@/context/BrandThemeContext";
import { useCart } from "@/context/CartContext";

const Header = () => {
    const { user, logout } = useAuth();
    const { theme } = useBrandTheme();
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleDashboard = () => {
        navigate(user?.role === "admin" ? "/admin" : "/retail");
    };

    return (
        <header
            className="sticky top-0 z-50 bg-white border-b"
            style={{ height: "70px", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}
        >
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <img
                        src="/logo-shopsmart.png"
                        alt="ShopSmart"
                        style={{ height: "48px", width: "auto" }}
                        className="object-contain"
                    />
                </Link>

                {/* Right actions */}
                <div className="flex items-center gap-2 ml-auto">
                    {user ? (
                        <>
                            <button
                                onClick={handleDashboard}
                                className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                                style={{ background: theme.secondary, color: theme.accent }}
                            >
                                <User className="h-4 w-4" />
                                Dashboard
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-colors"
                                style={{ background: theme.primary }}
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                    {/* Cart icon — routes to role-appropriate cart */}
                    <button
                        onClick={() => navigate(user?.role === "admin" ? "/admin/cart" : "/retail/cart")}
                        className="relative flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                        aria-label="Cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {user && totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>

        </header>
    );
};

export default Header;
