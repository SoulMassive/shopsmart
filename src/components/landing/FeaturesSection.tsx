import { motion } from "framer-motion";
import {
  ShoppingCart,
  MapPin,
  LayoutDashboard,
  FileText,
  Truck,
  TrendingUp,
} from "lucide-react";

const features = [
  { icon: ShoppingCart, title: "Retail Outlet Ordering", desc: "Outlets browse products, select quantities, and place orders with automatic discount tiers." },
  { icon: MapPin, title: "GPS Field Tracking", desc: "Real-time location tracking for field executives with route history and distance analytics." },
  { icon: LayoutDashboard, title: "Admin Dashboard", desc: "Complete oversight of outlets, executives, orders, and revenue in one command center." },
  { icon: FileText, title: "Auto Invoice Generation", desc: "Professional GST-compliant invoices generated automatically with every confirmed order." },
  { icon: Truck, title: "Order Tracking", desc: "End-to-end order status from placement through dispatch to final delivery." },
  { icon: TrendingUp, title: "Performance Monitoring", desc: "Track KPIs for executives, brands, and outlets with exportable reports." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => (
  <section id="features" className="py-20 md:py-32 relative">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase">Features</p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Everything You Need to Scale
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A complete toolkit for managing your retail distribution network from onboarding to delivery.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-primary/20" />
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
