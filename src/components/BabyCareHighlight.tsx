import { motion } from "framer-motion";
import { 
  Baby, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import babyCareHighlightImage from "@/assets/babycare/baby-care-highlight.jpg";

const features = [
  {
    icon: Baby,
    title: "Baby Essentials",
    description: "Diapers, feeding bottles, and daily necessities",
  },
  {
    icon: Heart,
    title: "Gentle Care",
    description: "Soft, hypoallergenic products for sensitive skin",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Brands",
    description: "Pampers, Johnson's, Huggies, and other reliable brands",
  },
  {
    icon: Sparkles,
    title: "Growth Products",
    description: "Nutrition and supplements for healthy development",
  },
];

interface BabyCareHighlightProps {
  onViewAll?: () => void;
}

export function BabyCareHighlight({ onViewAll }: BabyCareHighlightProps) {
  const handleViewAll = () => {
    document.getElementById('babycare-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      onViewAll?.();
    }, 500);
  };

  return (
    <section id="babycare-highlight" className="py-20 bg-gradient-to-br from-teal-50 to-cyan-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-teal-600 font-medium tracking-wider uppercase text-sm">
              Baby Care Division
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-800 mt-3 mb-6">
              Nurturing Your <span className="text-teal-600">Little Ones</span>
            </h2>
            <p className="font-body text-slate-600 text-lg mb-8 leading-relaxed">
              Every parent wants the best for their baby. Our Baby Care division offers premium products from trusted brands to ensure your little one receives gentle care and support for healthy growth.
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
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-800 mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="font-body bg-teal-600 text-white hover:bg-teal-500 px-6"
                onClick={handleViewAll}
              >
                Shop Baby Care
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="font-body border-2 border-teal-600 bg-transparent text-teal-600 hover:bg-teal-600 hover:text-white"
                onClick={handleViewAll}
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
                src={babyCareHighlightImage}
                alt="Baby care products"
                className="w-full h-auto"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-4 right-4 bg-teal-600 text-white font-display font-bold px-4 py-2 rounded-lg text-sm">
                Safe & Gentle
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 left-4 right-4 md:left-8 md:right-8 bg-white rounded-xl p-4 shadow-elegant"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-slate-800">
                    Parent Approved
                  </h5>
                  <p className="font-body text-sm text-slate-500">
                    Trusted by Nigerian families
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
