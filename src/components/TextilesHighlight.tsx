import { motion } from "framer-motion";
import { 
  Scissors, 
  Palette, 
  Sparkles, 
  Gift,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import blueLaceFabric from "@/assets/textiles/blue-lace-fabric.jpg";
const features = [
  {
    icon: Scissors,
    title: "Premium Fabrics",
    description: "High-quality lace, Ankara, Shaddah, Abaya, and traditional materials",
  },
  {
    icon: Palette,
    title: "Vibrant Designs",
    description: "Beautiful colors and patterns for every occasion",
  },
  {
    icon: Sparkles,
    title: "Occasion Ready",
    description: "Perfect fabrics for weddings, celebrations, and events",
  },
  {
    icon: Gift,
    title: "Bulk Orders",
    description: "Special rates for aso-ebi and group purchases",
  },
];

export function TextilesHighlight() {
  return (
    <section id="textiles-highlight" className="py-20 bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={blueLaceFabric}
                alt="Light blue men's lace fabric"
                className="w-full h-auto"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-4 left-4 bg-pink-500 text-white font-display font-bold px-4 py-2 rounded-lg text-sm">
                New Arrivals
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
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-foreground">
                    Aso-Ebi Specials
                  </h5>
                  <p className="font-body text-sm text-muted-foreground">
                    Group discounts available on selected fabrics
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="font-body text-pink-400 font-medium tracking-wider uppercase text-sm">
              Textiles & Materials Division
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mt-3 mb-6">
              Elegance in Every <span className="text-pink-400">Thread</span>
            </h2>
            <p className="font-body text-purple-200 text-lg mb-8 leading-relaxed">
              Discover our exquisite collection of fabrics and textiles. From luxurious 
              lace to stunning Ankara prints, we have the perfect materials for your 
              special occasions and everyday wear.
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
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-purple-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="font-body bg-pink-500 text-white hover:bg-pink-400 px-6"
                onClick={() => document.getElementById('textiles-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Explore Fabrics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="font-body border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50"
                onClick={() => document.getElementById('textiles-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                View Collection
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
