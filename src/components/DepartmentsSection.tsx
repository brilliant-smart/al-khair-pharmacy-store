import { motion } from "framer-motion";
import {
  ShoppingBasket,
  Pill,
  Laptop,
  Shirt,
  Baby,
  Warehouse,
  ArrowRight,
} from "lucide-react";

const departments = [
  {
    icon: ShoppingBasket,
    name: "Superstore",
    description: "Groceries, beverages, household essentials, and frozen foods",
    color: "from-emerald-500 to-green-600",
    items: ["Groceries", "Beverages", "Households", "Frozen Foods"],
    scrollTo: "superstore-highlight",
  },
  {
    icon: Pill,
    name: "Pharmacy",
    description:
      "Over-the-counter medicines, wellness products, and essential medical devices",
    color: "from-teal-500 to-emerald-600",
    items: ["OTC Medicines", "Wellness Products", "Medical Devices"],
    scrollTo: "pharmacy-highlight",
  },
  {
    icon: Laptop,
    name: "Electronics & Kitchen",
    description:
      "Modern electronics, kitchen appliances, utensils, and cookware",
    color: "from-cyan-500 to-teal-600",
    items: ["Electronics", "Appliances", "Utensils", "Cookware"],
    scrollTo: "electronics-highlight",
  },
  {
    icon: Shirt,
    name: "Textiles & Materials",
    description:
      "Quality clothing, fabrics, laces, Ankara, Shaddah, Abayas, gowns, ready-made wear, and a wide range of textile materials",
    color: "from-green-500 to-emerald-600",
    items: ["Clothing", "Fabrics", "Laces", "Ankara", "Abayas"],
    scrollTo: "textiles-highlight",
  },
  {
    icon: Baby,
    name: "Baby Care",
    description: "Baby food, diapers, toys, and health products",
    color: "from-lime-500 to-green-600",
    items: ["Baby Food", "Diapers", "Toys", "Health Products"],
    scrollTo: "babycare-highlight",
  },
  {
    icon: Warehouse,
    name: "Wholesales",
    description: "Bulk purchases, business supplies, and wholesale pricing",
    color: "from-amber-500 to-orange-600",
    items: ["Bulk Items", "Business Supplies", "Wholesale Deals"],
    scrollTo: "contact",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function DepartmentsSection() {
  return (
    <section id="departments" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-body text-primary font-medium tracking-wider uppercase text-sm">
            Our Departments
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Everything You Need
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
            Six comprehensive departments serving all your shopping needs under
            one roof
          </p>
        </motion.div>

        {/* Department cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {departments.map((dept, index) => (
            <motion.div
              key={dept.name}
              variants={itemVariants}
              className={`group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 cursor-pointer overflow-hidden ${
                index === 0 || index === 1 ? "lg:col-span-1" : ""
              }`}
            >
              {/* Hover gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <dept.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {dept.name}
              </h3>
              <p className="font-body text-muted-foreground mb-5 leading-relaxed">
                {dept.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {dept.items.map((item) => (
                  <span
                    key={item}
                    className="font-body text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Link */}
              <button
                onClick={() => {
                  const element = document.getElementById(dept.scrollTo);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 text-primary font-body font-medium group-hover:gap-3 transition-all"
              >
                <span>Explore</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
