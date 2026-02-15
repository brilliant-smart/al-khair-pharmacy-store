import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  fetchPublicProductsPaginated,
  PublicProduct,
} from "@/app/api/publicProducts";
import { fetchPublicDepartments } from "@/app/api/publicDepartments";
import type { PublicDepartment } from "@/app/api/publicDepartments";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=No+Image";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const departmentSlug = searchParams.get("department");
  const pageParam = searchParams.get("page");
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const [department, setDepartment] = useState<PublicDepartment | null>(null);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: null as number | null,
    to: null as number | null,
  });
  const [loading, setLoading] = useState(true);

  // Resolve department by slug from URL
  useEffect(() => {
    if (!departmentSlug) {
      navigate("/", { replace: true });
      return;
    }
    fetchPublicDepartments().then((list) => {
      const dept = list.find(
        (d) =>
          d.slug?.toLowerCase() === departmentSlug.toLowerCase() ||
          d.name?.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-") ===
            departmentSlug.toLowerCase()
      );
      if (!dept) {
        navigate("/", { replace: true });
        return;
      }
      setDepartment(dept);
    });
  }, [departmentSlug, navigate]);

  // Fetch paginated products when department and page are set
  useEffect(() => {
    if (!department) return;

    setLoading(true);
    fetchPublicProductsPaginated(department.id, currentPage)
      .then((res) => {
        setProducts(res.data);
        setPagination({
          current_page: res.current_page,
          last_page: res.last_page,
          per_page: res.per_page,
          total: res.total,
          from: res.from,
          to: res.to,
        });
      })
      .catch(() => {
        setProducts([]);
        setPagination((p) => ({ ...p, last_page: 1, total: 0 }));
      })
      .finally(() => setLoading(false));
  }, [department, currentPage]);

  const setPage = (page: number) => {
    const next = Math.max(1, Math.min(page, pagination.last_page));
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (next === 1) nextParams.delete("page");
      else nextParams.set("page", String(next));
      return nextParams;
    });
  };

  if (!departmentSlug) return null;

  const resolvingDept = !department && departmentSlug;

  const imageUrl = (p: PublicProduct) =>
    p.image_full_url ?? p.image ?? p.image_url ?? PLACEHOLDER_IMAGE;

  return (
    <div className="pt-24 pb-12 container mx-auto px-4">
      <div className="mb-8">
        <Link
          to="/"
          className="text-sm text-primary hover:underline font-body mb-2 inline-block"
        >
          ← Back to home
        </Link>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
          View All {department?.name ?? departmentSlug}
        </h1>
        <p className="font-body text-muted-foreground mt-1">
          {pagination.total > 0
            ? `Showing ${pagination.from}–${pagination.to} of ${pagination.total} products`
            : "All products in this section"}
        </p>
      </div>

      {resolvingDept || loading ? (
        <p className="text-muted-foreground">
          {resolvingDept ? "Loading…" : "Loading products…"}
        </p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">
          No products in this section yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="group bg-background rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={imageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-body font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-body text-base font-bold text-foreground mt-1">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {pagination.last_page > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter((p) => {
                    const cur = pagination.current_page;
                    const last = pagination.last_page;
                    return (
                      p === 1 ||
                      p === last ||
                      (p >= cur - 2 && p <= cur + 2)
                    );
                  })
                  .map((p, i, arr) => (
                    <span key={p} className="flex items-center gap-1">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-1 text-muted-foreground">…</span>
                      )}
                      <Button
                        variant={
                          p === pagination.current_page ? "default" : "outline"
                        }
                        size="sm"
                        className="min-w-[2.25rem]"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </span>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
