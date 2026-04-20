import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImageModal } from "./ProductImageModal";
import { useToast } from "@/hooks/use-toast";
import { fetchPublicProducts, PublicProduct } from "@/app/api/publicProducts";

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
  departmentId?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
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
  departmentId,
  isExpanded = false,
  onToggleExpand,
}: CategoryProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const { toast } = useToast();

  // Fetch all products when expanded
  useEffect(() => {
    if (isExpanded && departmentId && allProducts.length === 0) {
      loadAllProducts();
    }
  }, [isExpanded, departmentId]);

  const loadAllProducts = async () => {
    if (!departmentId) return;
    
    try {
      setLoadingAll(true);
      const apiProducts = await fetchPublicProducts(departmentId, 100); // Fetch up to 100 products
      
      // Transform API products to match Product interface
      // Sort to show featured products first
      const sorted = [...apiProducts].sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      });

      const transformed = sorted.map((product: PublicProduct) => ({
        id: product.id,
        name: product.name,
        price: product.price ? `₦${product.price.toLocaleString()}` : "₦0",
        rating: 4.8,
        image: product.image_full_url || product.image_url || product.image || PLACEHOLDER_IMAGE,
        badge: product.is_featured ? "Featured" : null,
        slug: product.slug,
      }));
      
      console.log('📦 Loaded products for View All:', transformed.length);
      console.log('📸 Sample product:', transformed[0]);
      
      setAllProducts(transformed);
    } catch (error) {
      console.error("Error loading all products:", error);
      toast({
        title: "Error",
        description: "Failed to load all products",
        variant: "destructive",
      });
    } finally {
      setLoadingAll(false);
    }
  };

  // Show all products when expanded (and loaded), otherwise show initial products
  const displayProducts = isExpanded && allProducts.length > 0 ? allProducts : products;

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
    // Always open modal for image preview, regardless of slug
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
                onClick={onToggleExpand}
                disabled={loadingAll}
              >
                {loadingAll ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      ⏳
                    </motion.div>
                    Loading...
                  </>
                ) : isExpanded ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    View All {title}
                  </>
                )}
              </Button>
            )}
          </motion.div>

          {/* Product grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? 'expanded' : 'collapsed'}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {displayProducts.length === 0 && isExpanded && !loadingAll && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              )}
              {displayProducts.map((product) => {
                return (
                  <motion.div key={product.id} variants={itemVariants}>
                    <div
                    className="group bg-background rounded-xl overflow-hidden border border-border"
                  >
                    {/* Image container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={product.image || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== PLACEHOLDER_IMAGE) {
                            target.src = PLACEHOLDER_IMAGE;
                          }
                        }}
                      />

                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-body text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
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
                  </div>
                </motion.div>
              );
            })}
            </motion.div>
          </AnimatePresence>

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
