import { motion } from "framer-motion";
import { 
  Shield, 
  Clock, 
  UserCheck, 
  FileText,
  Phone,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Licensed & Certified",
    description: "Licensed and fully certified by relevant pharmaceutical authorities",
  },
  {
    icon: Clock,
    title: "Extended Hours",
    description: "Open 7 days a week with extended hours for your convenience",
  },
  {
    icon: UserCheck,
    title: "Expert Pharmacists",
    description: "Licensed pharmacists available for consultations and expert advice",
  },
  {
    icon: FileText,
    title: "OTC Medicines",
    description: "Extensive range of over-the-counter medicines and wellness products",
  },
];

interface PharmacyHighlightProps {
  onViewAll?: () => void;
}

export function PharmacyHighlight({ onViewAll }: PharmacyHighlightProps) {
  const handleViewAll = () => {
    document.getElementById('pharmacy-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      onViewAll?.();
    }, 500);
  };

  return (
    <section id="pharmacy-highlight" className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-primary-foreground/80 font-medium tracking-wider uppercase text-sm">
              Pharmacy Division
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-6">
              Your Health,{" "}
              <span className="text-primary">Our Priority</span>
            </h2>
            <p className="font-body text-secondary-foreground/80 text-lg leading-relaxed mb-8">
              Al-Khair Pharmacy provides high-quality healthcare products and professional pharmaceutical services. Our licensed pharmacists are available to offer expert guidance and personalized care.
            </p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-body font-semibold mb-1">{feature.title}</h4>
                    <p className="font-body text-sm text-secondary-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body rounded-xl group"
                onClick={handleViewAll}
              >
                Visit Pharmacy
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground font-body rounded-xl"
                onClick={() => window.open("https://wa.me/2347063134838", "_blank")}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact Pharmacist
              </Button>
            </div>
          </motion.div>

          {/* Right content - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=700&fit=crop"
                alt="Al-Khair Pharmacy"
                className="w-full h-auto"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">
                      Certified Pharmacy
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      NAFDAC & PCN Licensed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl p-4 shadow-lg"
            >
              <p className="font-display text-3xl font-bold">10+</p>
              <p className="font-body text-xs">Years of Trust</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
