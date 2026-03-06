import { Link } from "react-router-dom";
import { useBrandTheme } from "@/context/BrandThemeContext";

const ShopFooter = () => {
    const { theme } = useBrandTheme();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-10 mt-10">
            <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-4 gap-8">
                {/* Brand */}
                <div>
                    <img
                        src="/logo-shopsmart.png"
                        alt="ShopsMart"
                        style={{ height: "70px", width: "auto" }}
                        className="object-contain mb-3"
                    />
                    <p className="text-sm text-gray-500">
                        B2B retail ordering platform. Order from trusted distributors directly.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">📧 support@shopsmart.in</p>
                </div>

                {/* Quick links */}
                {[
                    {
                        title: "Brands",
                        links: [
                            { label: "Jaya Janardhana", to: "/category/jaya-janardhana" },
                            { label: "SSR", to: "/category/ssr" },
                            { label: "Millets Pro", to: "/category/millets-pro" },
                        ],
                    },
                    {
                        title: "Account",
                        links: [
                            { label: "Login", to: "/login" },
                            { label: "Sign Up", to: "/signup" },
                            { label: "Dashboard", to: "/retail" },
                        ],
                    },
                    {
                        title: "Company",
                        links: [
                            { label: "About", to: "#" },
                            { label: "Contact", to: "#" },
                            { label: "Privacy Policy", to: "#" },
                        ],
                    },
                ].map((col) => (
                    <div key={col.title}>
                        <h4 className="font-semibold text-sm text-gray-700 mb-3">{col.title}</h4>
                        <ul className="space-y-2">
                            {col.links.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        to={l.to}
                                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} ShopsMart. All rights reserved.
            </div>
        </footer>
    );
};

export default ShopFooter;
