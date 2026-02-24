import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { getProducts, deleteProduct } from "@/app/api/products";
import { fetchPublicDepartments } from "@/app/api/publicDepartments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2, Search, Filter, Star, ArrowUpDown, CheckSquare, Square, Download, Package, History, Scan } from "lucide-react";
import BarcodeScanner from "@/components/BarcodeScanner";
import { createProduct, updateProduct } from "@/app/api/products";
import { Checkbox } from "@/components/ui/checkbox";
import { StockBadge } from "@/components/StockBadge";
import { StockAdjustmentModal } from "@/components/StockAdjustmentModal";
import { StockHistoryModal } from "@/components/StockHistoryModal";

interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  description: string | null;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image_url: string | null;
  image_full_url: string | null;
  department_id: number;
  is_active: boolean;
  is_featured: boolean;
  department: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Department {
  id: number;
  name: string;
  slug: string;
}

export default function ProductList() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");

  // Bulk operations state
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Stock management state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockHistoryModalOpen, setStockHistoryModalOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);
  
  // Barcode scanner state
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    barcode: "",
    description: "",
    price: "",
    department_id: "",
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, departments] = await Promise.all([
        getProducts(),
        fetchPublicDepartments(),
      ]);

      let allProducts = productsRes.data.data || productsRes.data;

      // Filter products for section heads
      if (user?.role === "section_head" && user?.department_id) {
        allProducts = allProducts.filter(
          (p: Product) => p.department_id === user.department_id
        );
      }

      setProducts(allProducts);
      setDepartments(departments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (product) => product.department_id === parseInt(selectedDepartment)
      );
    }

    // Apply featured filter
    if (featuredFilter === "featured") {
      filtered = filtered.filter((product) => product.is_featured);
    } else if (featuredFilter === "regular") {
      filtered = filtered.filter((product) => !product.is_featured);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.id - a.id;
        case "oldest":
          return a.id - b.id;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchQuery, selectedDepartment, featuredFilter, sortBy]);

  // Keyboard shortcuts - placed after filteredProducts is defined
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A or Cmd+A to select all (only when not in input fields)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && 
          !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        if (filteredProducts.length > 0) {
          setSelectedProducts(filteredProducts.map(p => p.id));
          toast({
            title: "All Products Selected",
            description: `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} selected`,
          });
        }
      }

      // Escape to clear selection
      if (e.key === 'Escape' && selectedProducts.length > 0) {
        setSelectedProducts([]);
        toast({
          title: "Selection Cleared",
          description: "All products deselected",
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredProducts, selectedProducts, toast]);

  const handleToggleFeatured = async (product: Product) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('is_featured', !product.is_featured ? '1' : '0');

      await updateProduct(product.id, formData);
      
      toast({
        title: "Success",
        description: `Product ${!product.is_featured ? 'featured' : 'unfeatured'} successfully`,
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      sku: "",
      barcode: "",
      description: "",
      price: "",
      department_id: user?.role === "section_head" ? String(user.department_id) : "",
      is_active: true,
    });
    setImageFile(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || "",
      barcode: (product as any).barcode || "",
      description: product.description || "",
      price: String(product.price),
      department_id: String(product.department_id),
      is_active: product.is_active,
    });
    setImageFile(null);
    setFormDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Product slug is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (!formData.department_id) {
      toast({
        title: "Validation Error",
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("slug", formData.slug.trim());
      if (formData.sku) formDataToSend.append("sku", formData.sku.trim());
      if (formData.barcode) formDataToSend.append("barcode", formData.barcode.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("department_id", formData.department_id);
      formDataToSend.append("is_active", formData.is_active ? "1" : "0");
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formDataToSend);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProduct(formDataToSend);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setFormDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Product save error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to save product';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        toast({
          title: "Validation Error",
          description: Array.isArray(firstError) ? firstError[0] : firstError,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  // Bulk Operations Functions
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkActivate = async () => {
    const count = selectedProducts.length;
    try {
      const promises = selectedProducts.map((id) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('is_active', '1');
        return updateProduct(id, formData);
      });

      await Promise.all(promises);
      toast({
        title: "✓ Bulk Activate Successful",
        description: `${count} product${count !== 1 ? 's' : ''} activated successfully`,
      });
      setSelectedProducts([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to activate ${count} product${count !== 1 ? 's' : ''}`,
        variant: "destructive",
      });
    }
  };

  const handleBulkDeactivate = async () => {
    const count = selectedProducts.length;
    try {
      const promises = selectedProducts.map((id) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('is_active', '0');
        return updateProduct(id, formData);
      });

      await Promise.all(promises);
      toast({
        title: "✓ Bulk Deactivate Successful",
        description: `${count} product${count !== 1 ? 's' : ''} deactivated successfully`,
      });
      setSelectedProducts([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to deactivate ${count} product${count !== 1 ? 's' : ''}`,
        variant: "destructive",
      });
    }
  };

  const handleBulkFeature = async () => {
    const count = selectedProducts.length;
    try {
      const promises = selectedProducts.map((id) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('is_featured', '1');
        return updateProduct(id, formData);
      });

      await Promise.all(promises);
      toast({
        title: "✓ Bulk Feature Successful",
        description: `${count} product${count !== 1 ? 's' : ''} marked as featured`,
      });
      setSelectedProducts([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to feature ${count} product${count !== 1 ? 's' : ''}`,
        variant: "destructive",
      });
    }
  };

  const handleBulkUnfeature = async () => {
    const count = selectedProducts.length;
    try {
      const promises = selectedProducts.map((id) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('is_featured', '0');
        return updateProduct(id, formData);
      });

      await Promise.all(promises);
      toast({
        title: "✓ Bulk Unfeature Successful",
        description: `${count} product${count !== 1 ? 's' : ''} removed from featured`,
      });
      setSelectedProducts([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to unfeature ${count} product${count !== 1 ? 's' : ''}`,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedProducts.length;
    try {
      const promises = selectedProducts.map((id) => deleteProduct(id));
      await Promise.all(promises);
      
      toast({
        title: "✓ Bulk Delete Successful",
        description: `${count} product${count !== 1 ? 's' : ''} deleted permanently`,
      });
      setSelectedProducts([]);
      setBulkDeleteDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete ${count} product${count !== 1 ? 's' : ''}`,
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const productsToExport = selectedProducts.length > 0
      ? filteredProducts.filter((p) => selectedProducts.includes(p.id))
      : filteredProducts;

    if (productsToExport.length === 0) {
      toast({
        title: "No Products",
        description: "No products to export",
        variant: "destructive",
      });
      return;
    }

    // Sort products by ID in ascending order for CSV export
    const sortedProducts = [...productsToExport].sort((a, b) => a.id - b.id);

    // Enhanced CSV headers with serial number and quantity
    const headers = ["S/N", "Product ID", "Name", "Department", "Price (₦)", "Stock Quantity", "Stock Status", "Status", "Featured", "Slug"];
    
    // Map products with serial numbers and quantity
    const rows = sortedProducts.map((p, index) => [
      index + 1, // Serial number starting from 1
      p.id,
      p.name,
      p.department.name,
      p.price,
      p.stock_quantity,
      p.stock_status.replace('_', ' ').toUpperCase(),
      p.is_active ? "Active" : "Inactive",
      p.is_featured ? "Yes" : "No",
      p.slug,
    ]);

    // Create CSV content with proper escaping
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `al-khair-products-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "✓ Export Successful",
      description: `${productsToExport.length} product${productsToExport.length !== 1 ? 's' : ''} exported to CSV`,
    });

    // Clear selection after export if items were selected
    if (selectedProducts.length > 0) {
      setSelectedProducts([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500 mt-1">
            Manage your product inventory
            {user?.role === "section_head" && " for your department"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {selectedProducts.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProducts([])}
                className="h-7 text-xs"
              >
                Clear
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkActivate}
                className="h-8"
              >
                <CheckSquare className="mr-1 h-3 w-3" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeactivate}
                className="h-8"
              >
                <Square className="mr-1 h-3 w-3" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkFeature}
                className="h-8"
              >
                <Star className="mr-1 h-3 w-3" />
                Feature
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkUnfeature}
                className="h-8"
              >
                <Star className="mr-1 h-3 w-3 fill-gray-300" />
                Unfeature
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="h-8"
              >
                <Download className="mr-1 h-3 w-3" />
                Export CSV
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
                className="h-8"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Department Filter */}
        {user?.role === "master_admin" && (
          <div className="w-full sm:w-[200px]">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Featured Filter */}
        <div className="w-full sm:w-[180px]">
          <Select
            value={featuredFilter}
            onValueChange={setFeaturedFilter}
          >
            <SelectTrigger>
              <Star className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="regular">Regular Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div className="w-full sm:w-[200px]">
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                  className={
                    selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length
                      ? "data-[state=checked]:bg-blue-500"
                      : ""
                  }
                  {...(selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length
                    ? { "data-indeterminate": "true" }
                    : {})}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {searchQuery || selectedDepartment !== "all"
                    ? "No products match your search criteria."
                    : "No products found. Click \"Add Product\" to create one."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    {product.image_full_url ? (
                      <img
                        src={product.image_full_url}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.department.name}</TableCell>
                  <TableCell>₦{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <StockBadge 
                        stockStatus={product.stock_status} 
                        stockQuantity={product.stock_quantity}
                        showQuantity
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          product.is_featured
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProductForStock(product);
                          setStockModalOpen(true);
                        }}
                        title="Manage Stock"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProductForStock(product);
                          setStockHistoryModalOpen(true);
                        }}
                        title="Stock History"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProductToDelete(product);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{productToDelete?.name}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedProducts.length} products?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedProducts.length} selected product{selectedProducts.length > 1 ? 's' : ''}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Product Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the product details below"
                : "Fill in the details to create a new product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g., Golden Penny Semovita 2kg"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (auto-generated)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="golden-penny-semovita-2kg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU (optional)</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                />
              </div>

              <div>
                <Label htmlFor="barcode">Barcode (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Scan or enter barcode"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowBarcodeScanner(true)}
                    title="Scan barcode"
                  >
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="8500"
              />
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, department_id: value })
                }
                disabled={user?.role === "section_head"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the product"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 2MB
              </p>
              {editingProduct?.image_full_url && !imageFile && (
                <img
                  src={editingProduct.image_full_url}
                  alt="Current"
                  className="mt-2 h-24 w-24 object-cover rounded border"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (visible to customers)
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        open={stockModalOpen}
        onClose={() => {
          setStockModalOpen(false);
          setSelectedProductForStock(null);
        }}
        product={selectedProductForStock}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* Stock History Modal */}
      <StockHistoryModal
        open={stockHistoryModalOpen}
        onClose={() => {
          setStockHistoryModalOpen(false);
          setSelectedProductForStock(null);
        }}
        productId={selectedProductForStock?.id || null}
        productName={selectedProductForStock?.name || ""}
      />

      {/* Barcode Scanner Dialog */}
      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Scan Product Barcode</DialogTitle>
          </DialogHeader>
          <BarcodeScanner
            onScan={(barcode) => {
              setFormData({ ...formData, barcode });
              setShowBarcodeScanner(false);
              toast({
                title: "Barcode Scanned",
                description: `Barcode: ${barcode}`,
              });
            }}
            onClose={() => setShowBarcodeScanner(false)}
            title="Scan barcode for product"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
