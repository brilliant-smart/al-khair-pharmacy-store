import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImageModal } from "./ProductImageModal";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  badge?: string | null;
  slug?: string;
}

interface CategoryProductsSectionProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
  bgClass?: string;
  showPrice?: boolean;
  viewAllHref?: string;
}

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

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=No+Image";

export function CategoryProductsSection({
  id,
  title,
  subtitle,
  products,
  bgClass = "bg-background",
  showPrice = false,
  viewAllHref,
}: CategoryProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleViewProduct = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.slug) return; // navigation handled by Link
    setSelectedProduct(product);
  };

  return (
    <>
      <section id={id} className={`py-20 ${bgClass}`}>
        <div className="container mx-auto px-4">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <span className="font-body text-primary font-medium tracking-wider uppercase text-sm">
                {subtitle}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
                {title}
              </h2>
            </div>
            {viewAllHref ? (
              <Link to={viewAllHref}>
                <Button
                  variant="outline"
                  className="font-body self-start md:self-auto border-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:shadow-glow"
                >
                  View All {title}
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="font-body self-start md:self-auto border-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:shadow-glow"
              >
                View All {title}
              </Button>
            )}
          </motion.div>

          {/* Product grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((product) => {
              const CardWrapper = product.slug ? Link : "div";
              const cardProps = product.slug
                ? { to: `/products/${product.slug}` }
                : {};
              return (
                <motion.div key={product.id} variants={itemVariants}>
                  <CardWrapper
                    {...cardProps}
                    className="group bg-background rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-500 block"
                  >
                    {/* Image container */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-xs font-medium px-2 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}

                      {/* Quick actions */}
                      <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          className="bg-background text-foreground hover:bg-primary hover:text-primary-foreground rounded-full w-10 h-10"
                          onClick={(e) => handleViewProduct(e, product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="bg-primary text-primary-foreground hover:bg-secondary rounded-full w-10 h-10"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-body text-sm md:text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        {showPrice && (
                          <span className="font-body text-base md:text-lg font-bold text-foreground">
                            {product.price}
                          </span>
                        )}
                        <div
                          className={`flex items-center gap-1 ${
                            !showPrice ? "ml-auto" : ""
                          }`}
                        >
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-body text-xs text-muted-foreground">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Product Image Modal */}
      <ProductImageModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        image={selectedProduct?.image || ""}
        productName={selectedProduct?.name || ""}
      />
    </>
  );
}
