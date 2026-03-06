import { motion } from "framer-motion";
import { ArrowRight, BarChart3, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const floatingCards = [
  { icon: ShoppingCart, label: "Orders", value: "2,847", delay: 0.8 },
  { icon: MapPin, label: "Outlets", value: "1,204", delay: 1.0 },
  { icon: BarChart3, label: "Revenue", value: "₹12.4L", delay: 1.2 },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
            Now in Beta — Start for Free
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Smart Retail{" "}
            <span className="text-gradient">Distribution</span>{" "}
            Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Digitize outlet onboarding, order management, and field tracking
            with real-time transparency across your entire distribution network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button size="lg" className="gap-2 text-base px-8" onClick={() => navigate("/admin")}>
              Start Demo <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              Login
            </Button>
          </motion.div>

          {/* Quick role links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2 justify-center mt-6"
          >
            {[
              { label: "Admin Panel", path: "/admin" },
              { label: "Retail Portal", path: "/retail" },
              { label: "Field Executive", path: "/field" },
            ].map((r) => (
              <button
                key={r.path}
                onClick={() => navigate(r.path)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              >
                {r.label} →
              </button>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {floatingCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              className="glass rounded-2xl p-5 w-40 md:w-48 shadow-card animate-float"
              style={{ animationDelay: `${card.delay}s` }}
            >
              <card.icon className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
