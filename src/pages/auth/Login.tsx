import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowLeft } from "lucide-react";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await api.post("/auth/login", { identifier, password });
            login(data.token, data);
            toast.success("Welcome back!");
            let redirectPath = "/retail";
            if (data.role === "admin") redirectPath = "/admin";
            else if (data.role === "executive") redirectPath = "/field";
            
            navigate(redirectPath);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 relative">
            <Link 
                to="/" 
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground bg-background/50 hover:bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm transition-all shadow-sm font-medium z-10"
            >
                <ArrowLeft size={18} />
                <span>Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-card"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img src="/logo-shopsmart.png" alt="ShopsMart" className="h-14 w-auto object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Login</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="identifier">Email or Phone</Label>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="Email address or 10-digit phone number"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
