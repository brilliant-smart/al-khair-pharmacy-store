import { api } from "@/app/lib/api";

export interface PublicProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  price: number;
  stock_quantity?: number;
  low_stock_threshold?: number;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  image?: string | null;
  /** Laravel Product appends image_full_url (full URL to storage) */
  image_full_url?: string | null;
  image_url?: string | null;
  department_id?: number; // optional for list views
  is_featured?: boolean; // featured products flag
  is_active?: boolean; // product active status
}

/**
 * This update:
 * Fetches public product list and,
 * Allows optional department filter
 */
export async function fetchPublicProducts(
  departmentId?: number,
  limit?: number,
  search?: string,
) {
  const res = await api.get("/products", {
    params: {
      ...(departmentId ? { department_id: departmentId } : {}),
      ...(limit ? { limit } : {}),
      ...(search ? { search } : {}),
    },
  });

  // Laravel may return { data: [...] }; Axios puts response in res.data
  const raw = res.data;
  if (Array.isArray(raw)) return raw as PublicProduct[];
  if (raw && typeof raw === "object" && Array.isArray(raw.data))
    return raw.data as PublicProduct[];
  return [];
}

/** Laravel paginated response shape */
export interface ProductsPaginatedResponse {
  data: PublicProduct[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

/**
 * Fetch products with pagination (for "View All" section pages).
 * Requires departmentId so results are scoped to one section.
 */
export async function fetchPublicProductsPaginated(
  departmentId: number,
  page: number = 1,
  search?: string
): Promise<ProductsPaginatedResponse> {
  const res = await api.get("/products", {
    params: {
      department_id: departmentId,
      page,
      ...(search ? { search } : {}),
    },
  });

  const raw = res.data;
  if (raw && typeof raw === "object" && Array.isArray(raw.data)) {
    return {
      data: raw.data as PublicProduct[],
      current_page: raw.current_page ?? 1,
      last_page: raw.last_page ?? 1,
      per_page: raw.per_page ?? 12,
      total: raw.total ?? 0,
      from: raw.from ?? null,
      to: raw.to ?? null,
      first_page_url: raw.first_page_url ?? "",
      last_page_url: raw.last_page_url ?? "",
      next_page_url: raw.next_page_url ?? null,
      prev_page_url: raw.prev_page_url ?? null,
    };
  }
  return {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: null,
    to: null,
    first_page_url: "",
    last_page_url: "",
    next_page_url: null,
    prev_page_url: null,
  };
}

/**
 * Fetch single public product by slug
 */
export async function fetchPublicProduct(slug: string) {
  const res = await api.get<PublicProduct>(`/products/${slug}`);
  return res.data;
}
