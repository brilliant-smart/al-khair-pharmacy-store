import { motion } from "framer-motion";
import { 
  ShoppingBasket, 
  Clock, 
  Truck, 
  BadgePercent,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShoppingBasket,
    title: "Fresh Daily Stock",
    description: "Daily restocked groceries and essential household items",
  },
  {
    icon: Clock,
    title: "Extended Hours",
    description: "Extended hours for your convenience",
  },
  {
    icon: Truck,
    title: "Bulk Delivery",
    description: "Reliable delivery on larger purchases",
  },
  {
    icon: BadgePercent,
    title: "Best Prices",
    description: "Competitive pricing across all essential goods",
  },
];

export function SuperstoreHighlight() {
  return (
    <section id="superstore-highlight" className="py-20 bg-primary overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-primary-foreground/80 font-medium tracking-wider uppercase text-sm">
              Superstore Division
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mt-3 mb-6">
              Quality Products, <span className="text-amber-300">Best Prices</span>
            </h2>
            <p className="font-body text-primary-foreground/90 text-lg mb-8 leading-relaxed">
              Al-Khair Superstore is your trusted destination for all household essentials. 
              From fresh groceries to premium brands, we deliver quality and affordability 
              for families across Bauchi.
            </p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-primary-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="font-body bg-amber-400 text-primary hover:bg-amber-300 px-6"
                onClick={() => document.getElementById('superstore-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="font-body border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
                onClick={() => document.getElementById('superstore-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                View All Products
              </Button>
            </div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop"
                alt="Superstore products display"
                className="w-full h-auto"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-4 right-4 bg-amber-400 text-primary font-display font-bold px-4 py-2 rounded-lg text-sm">
                1000+ Products
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 left-4 right-4 md:left-8 md:right-8 bg-background rounded-xl p-4 shadow-elegant"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBasket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-foreground">
                    Trusted by Thousands
                  </h5>
                  <p className="font-body text-sm text-muted-foreground">
                    Proudly serving Bauchi families since 2025
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
