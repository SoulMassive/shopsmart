import { motion } from "framer-motion";
import { Store, Shield, Map, Receipt } from "lucide-react";

const modules = [
  { icon: Store, label: "Retail Portal", color: "bg-primary" },
  { icon: Shield, label: "Admin Dashboard", color: "bg-primary-dark" },
  { icon: Map, label: "Maps & Tracking", color: "bg-primary-glow" },
  { icon: Receipt, label: "Invoice System", color: "bg-accent" },
];

const PlatformOverview = () => (
  <section id="platform" className="py-20 md:py-32 bg-secondary/30">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase">Platform</p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          One Platform, All Modules
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Every piece of your distribution network connected in a single, unified system.
        </p>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {/* Center hub */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-glow z-10 relative border border-border"
        >
          <img src="/logo-shopsmart.png" alt="ShopsMart" className="h-14 w-14 object-contain" />
        </motion.div>

        {/* Modules around */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-10">
          {modules.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-14 w-14 rounded-2xl bg-card shadow-card flex items-center justify-center border border-border">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center text-muted-foreground">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PlatformOverview;
