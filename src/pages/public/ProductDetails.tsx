import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicProduct, PublicProduct } from "@/app/api/publicProducts";

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
    return <p className="text-muted-foreground">Loading product…</p>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!product) {
    return <p className="text-destructive">Product not found.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-muted rounded flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-contain max-h-full"
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            No image available
          </span>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

        <p className="text-xl font-semibold mb-4">
          ₦{product.price.toLocaleString()}
        </p>

        <p className="text-muted-foreground">
          Product description coming later.
        </p>
      </div>
    </div>
  );
}
