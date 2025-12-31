import { motion } from "framer-motion";
import { 
  Tv, 
  Zap, 
  Wrench, 
  BadgeCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Tv,
    title: "Top Brands",
    description: "Trusted brands including Samsung, LG, Sony, Nexus, Skyrun, Haier, Hisense, and more",
  },
  {
    icon: Zap,
    title: "Energy Efficient",
    description: "Modern appliances that save power and reduce bills",
  },
  {
    icon: Wrench,
    title: "Warranty Covered",
    description: "Covered by manufacturer warranty for peace of mind",
  },
  {
    icon: BadgeCheck,
    title: "Genuine Products",
    description: "100% authentic products with verified authenticity",
  },
];

export function ElectronicsHighlight() {
  return (
    <section id="electronics-highlight" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-blue-400 font-medium tracking-wider uppercase text-sm">
              Electronics & Kitchen Division
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mt-3 mb-6">
              Modern Living, <span className="text-blue-400">Smart Choices</span>
            </h2>
            <p className="font-body text-slate-300 text-lg mb-8 leading-relaxed">
              Upgrade your home with high quality electronics and kitchen appliances. 
              From smart TVs to energy-efficient washing machines, we bring the best technology 
              to your homes at competitive prices.
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
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="font-body bg-blue-500 text-white hover:bg-blue-400 px-6"
                onClick={() => document.getElementById('electronics-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Shop Electronics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="font-body border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50"
                onClick={() => document.getElementById('electronics-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Browse Electronics
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
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop"
                alt="Modern electronics display"
                className="w-full h-auto"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white font-display font-bold px-4 py-2 rounded-lg text-sm">
                Latest Tech
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
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Tv className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-foreground">
                    Quality Guaranteed
                  </h5>
                  <p className="font-body text-sm text-muted-foreground">
                    Selected products include manufacturer warranty
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
