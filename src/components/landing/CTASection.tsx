import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="py-20 md:py-32">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative rounded-3xl gradient-hero p-10 md:p-16 text-center overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="absolute bottom-[-40px] left-[-40px] w-36 h-36 rounded-full bg-primary-foreground/10 blur-2xl" />

        <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4 relative z-10">
          Start Digitizing Your Distribution Network Today
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg relative z-10">
          Join hundreds of brands streamlining their retail operations with real-time tracking and analytics.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="gap-2 text-base px-8 relative z-10"
        >
          Create Account <ArrowRight size={18} />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
