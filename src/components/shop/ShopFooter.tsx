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
                        alt="ShopSmart"
                        style={{ height: "70px", width: "auto" }}
                        className="object-contain mb-3"
                    />
                    <p className="text-sm text-gray-500">
                        B2B retail ordering platform. Order from trusted distributors directly.
                    </p>
                    <div className="text-sm text-gray-400 mt-4 space-y-2">
                        <p>📍 123 Tech Avenue, Bangalore, India</p>
                        <p>📧 <a href="mailto:support@shopsmart.in" className="hover:text-gray-800 transition-colors">support@shopsmart.in</a></p>
                        <p>📞 <a href="tel:+919876543210" className="hover:text-gray-800 transition-colors">+91 98765 43210</a></p>
                        <p>💬 <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">WhatsApp Us</a></p>
                    </div>
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
                © {new Date().getFullYear()} ShopSmart. All rights reserved.
            </div>
        </footer>
    );
};

export default ShopFooter;
