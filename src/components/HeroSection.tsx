import { motion } from "framer-motion";
import { ArrowRight, Shield, BadgeCheck, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import storeImage from "@/assets/carousel/superstore.jpg";
import electronicsImage from "@/assets/carousel/electronics.jpg";
import pharmacyImage from "@/assets/carousel/pharmacy.jpg";
import babyClothsImage from "@/assets/carousel/baby-cloths.jpg";
import textilesImage from "@/assets/carousel/textiles-materials.jpg";

const departments = [
  {
    id: 1,
    name: "Superstore",
    tagline: "Fresh groceries & household essentials",
    description: "Premium quality groceries, fresh produce, and daily essentials for your home.",
    image: storeImage,
    icon: "🛒",
  },
  {
    id: 2,
    name: "Pharmacy",
    tagline: "Licensed healthcare professionals",
    description: "Certified pharmacists, prescription services, and quality healthcare products.",
    image: pharmacyImage,
    icon: "💊",
  },
  {
    id: 3,
    name: "Electronics & Kitchen Appliances",
    tagline: "Modern technology for modern living",
    description: "Kitchen gadgets, home appliances, and cutting-edge electronics.",
    image: electronicsImage,
    icon: "🔌",
  },
  {
    id: 4,
    name: "Textiles & Materials",
    tagline: "Quality fabrics & fashion materials",
    description: "Premium textiles, fabrics, and materials for all your fashion needs.",
    image: textilesImage,
    icon: "🧵",
  },
  {
    id: 5,
    name: "Baby Care",
    tagline: "Everything for your little ones",
    description: "Safe, trusted products for babies and toddlers - from diapers to toys.",
    image: babyClothsImage,
    icon: "👶",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="hero" className="relative min-h-[100vh] flex flex-col overflow-hidden bg-muted">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Hero Header Content */}
      <div className="container mx-auto px-4 pt-32 pb-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-8"
          >
            <BadgeCheck className="h-4 w-4" />
            <span className="font-body text-sm font-medium">Licensed Pharmacy & Certified Store</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Your Trusted{" "}
            <span className="gradient-text">Supermarket</span>
            <br />
            & Pharmacy
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Experience premium shopping at Bauchi's most trusted retail destination, 
            offering quality healthcare, electronics, and everyday essentials — all under one roof.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground font-body px-8 py-6 text-lg rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 group"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-body px-8 py-6 text-lg rounded-xl border-2 border-primary/20 transition-all duration-300 hover:border-primary/5 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:shadow-glow"
            >
              Visit Pharmacy
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-foreground text-sm">Licensed</p>
                <p className="font-body text-xs">Pharmacy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-foreground text-sm">Quality</p>
                <p className="font-body text-xs">Guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-foreground text-sm">In-Store</p>
                <p className="font-body text-xs">Pickup</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Department Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 flex-1 pb-8"
      >
        {/* Section label */}
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-primary uppercase tracking-wider font-body">
            Explore Our Departments
          </span>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto px-4">
          <div ref={emblaRef} className="overflow-hidden rounded-2xl">
            <div className="flex">
              {departments.map((dept, index) => (
                <div
                  key={dept.id}
                  className="flex-[0_0_90%] md:flex-[0_0_80%] min-w-0 pl-4 first:pl-0"
                >
                  <motion.div
                    animate={{
                      opacity: currentSlide === index ? 1 : 0.6,
                      scale: currentSlide === index ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative h-[280px] md:h-[350px] rounded-2xl overflow-hidden shadow-elegant cursor-pointer group"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={dept.image}
                        alt={dept.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/60 to-secondary/20" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl md:text-4xl">{dept.icon}</span>
                        <h3 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground">
                          {dept.name}
                        </h3>
                      </div>
                      <p className="text-primary-foreground/90 text-sm md:text-base font-medium font-body mb-2">
                        {dept.tagline}
                      </p>
                      <p className="text-primary-foreground/70 text-sm font-body max-w-md hidden md:block">
                        {dept.description}
                      </p>
                      
                      {/* Explore button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4 w-fit bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-0 backdrop-blur-sm font-body"
                      >
                        Explore {dept.name}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm shadow-elegant flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm shadow-elegant flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {departments.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto fill-background"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
}
