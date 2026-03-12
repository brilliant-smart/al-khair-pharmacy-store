import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPublicProduct, PublicProduct } from "@/app/api/publicProducts";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x600?text=No+Image";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    fetchPublicProduct(slug)
      .then(setProduct)
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground text-lg">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive text-lg">{error || "Product not found."}</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use image_full_url or image_url or fallback to placeholder
  const productImage = product.image_full_url || product.image_url || product.image || PLACEHOLDER_IMAGE;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back button */}
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      {/* Product details */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product image */}
        <Card className="p-6">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        </Card>

        {/* Product info */}
        <div className="flex flex-col gap-6">
          <div>
            {product.is_featured && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-3xl md:text-4xl font-bold text-primary">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          {/* Stock info */}
          <div className="flex items-center gap-2">
            {product.stock_quantity !== undefined && (
              <>
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.stock_quantity} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              {product.description || "Product description coming soon."}
            </p>
          </div>

          {/* Add to cart button */}
          <Button 
            size="lg" 
            className="w-full md:w-auto"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>

          {/* Additional info */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Product Information</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {product.unit_type && (
                <>
                  <dt className="text-muted-foreground">Unit Type:</dt>
                  <dd className="font-medium capitalize">{product.unit_type}</dd>
                </>
              )}
              {product.barcode && (
                <>
                  <dt className="text-muted-foreground">Barcode:</dt>
                  <dd className="font-medium">{product.barcode}</dd>
                </>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
