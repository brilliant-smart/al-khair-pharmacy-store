import { motion } from "framer-motion";
import { Award, Users, ShoppingBag, Clock, Shield, ThumbsUp } from "lucide-react";

const stats = [
  { icon: Clock, value: "10+", label: "Years of Retail Experience", color: "text-primary" },
  { icon: Users, value: "50K+", label: "Happy Customers", color: "text-primary" },
  { icon: ShoppingBag, value: "15K+", label: "Products Available", color: "text-primary" },
  { icon: Award, value: "100%", label: "Licensed & Certified", color: "text-primary" },
];

const trustBadges = [
  { icon: Shield, text: "Licensed Pharmacy" },
  { icon: ThumbsUp, text: "Quality You Can Trust" },
  { icon: Award, text: "NAFDAC Approved" },
];

export function TrustSection() {
  return (
    <section id="about" className="py-20 bg-muted relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-body text-primary text-sm uppercase tracking-widest mb-4 block">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by Families
            <span className="block gradient-text">Across Bauchi</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
            Built on years of retail experience, Al-Khair brings together trusted businesses under one modern destination, delivering quality products, genuine medications, and dependable service to families across Bauchi.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 md:p-8 text-center shadow-card hover:shadow-elegant transition-shadow duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <span className="font-display text-3xl md:text-4xl font-bold text-secondary block mb-2">
                {stat.value}
              </span>
              <span className="font-body text-sm text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {trustBadges.map((badge) => (
            <div key={badge.text} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <badge.icon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="font-body text-foreground font-medium">
                {badge.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Testimonial highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-background rounded-3xl p-8 md:p-12 shadow-elegant max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display text-2xl text-primary">"</span>
          </div>
          <blockquote className="font-display text-xl md:text-2xl text-foreground italic mb-6 leading-relaxed">
            Al-Khair has been our family’s trusted choice for years. From everyday household needs to healthcare and lifestyle essentials, their consistency, quality, and customer care truly stand out in Bauchi.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="font-display text-secondary font-bold">K</span>
            </div>
            <div className="text-left">
              <span className="font-body font-semibold text-foreground block">
                Khajidah Agwam
              </span>
              <span className="font-body text-sm text-muted-foreground">
                Loyal Customer since 2025
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
