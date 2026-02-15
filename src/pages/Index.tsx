import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { CategoryProductsSection } from "@/components/CategoryProductsSection";
import { SuperstoreHighlight } from "@/components/SuperstoreHighlight";
import { PharmacyHighlight } from "@/components/PharmacyHighlight";
import { ElectronicsHighlight } from "@/components/ElectronicsHighlight";
import { TextilesHighlight } from "@/components/TextilesHighlight";
import { BabyCareHighlight } from "@/components/BabyCareHighlight";
import { TrustSection } from "@/components/TrustSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import {
  fetchPublicProducts,
  PublicProduct,
} from "@/app/api/publicProducts";
import { fetchPublicDepartments, PublicDepartment } from "@/app/api/publicDepartments";

const Index = () => {
  const [departments, setDepartments] = useState<PublicDepartment[]>([]);
  const [superstoreProducts, setSuperstoreProducts] = useState<any[]>([]);
  const [pharmacyProducts, setPharmacyProducts] = useState<any[]>([]);
  const [electronicsProducts, setElectronicsProducts] = useState<any[]>([]);
  const [textilesProducts, setTextilesProducts] = useState<any[]>([]);
  const [babyCareProducts, setBabyCareProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch all departments first
      const depts = await fetchPublicDepartments();
      setDepartments(depts);

      // Create a map of department slug to id
      const deptMap = depts.reduce((acc, dept) => {
        acc[dept.slug] = dept.id;
        return acc;
      }, {} as Record<string, number>);

      // Fetch products for each department (limit to 4 for homepage display)
      const [superstore, pharmacy, electronics, textiles, babyCare] = await Promise.all([
        fetchPublicProducts(deptMap['superstore'], 4),
        fetchPublicProducts(deptMap['pharmacy'], 4),
        fetchPublicProducts(deptMap['electronics-kitchen'], 4),
        fetchPublicProducts(deptMap['textiles'], 4),
        fetchPublicProducts(deptMap['baby-care'], 4),
      ]);

      // Transform API products to match the format expected by CategoryProductsSection
      setSuperstoreProducts(transformProducts(superstore));
      setPharmacyProducts(transformProducts(pharmacy));
      setElectronicsProducts(transformProducts(electronics));
      setTextilesProducts(transformProducts(textiles));
      setBabyCareProducts(transformProducts(babyCare));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformProducts = (products: PublicProduct[]) => {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price ? `₦${product.price.toLocaleString()}` : "₦0",
      rating: 4.8, // Default rating
      image: product.image_full_url || product.image_url || "https://via.placeholder.com/400",
      badge: null,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DepartmentsSection />
        
        {/* Superstore */}
        <SuperstoreHighlight />
        <CategoryProductsSection
          id="superstore-products"
          title="Superstore"
          subtitle="Groceries & Essentials"
          products={superstoreProducts}
          bgClass="bg-muted/30"
        />
        
        {/* Pharmacy */}
        <PharmacyHighlight />
        <CategoryProductsSection
          id="pharmacy-products"
          title="Pharmacy"
          subtitle="Health & Wellness"
          products={pharmacyProducts}
          bgClass="bg-background"
        />
        
        {/* Electronics */}
        <ElectronicsHighlight />
        <CategoryProductsSection
          id="electronics-products"
          title="Electronics & Kitchen"
          subtitle="Appliances & Gadgets"
          products={electronicsProducts}
          bgClass="bg-muted/30"
        />
        
        {/* Textiles */}
        <TextilesHighlight />
        <CategoryProductsSection
          id="textiles-products"
          title="Textiles & Materials"
          subtitle="Fabrics & Home Decor"
          products={textilesProducts}
          bgClass="bg-background"
        />
        
        {/* Baby Care */}
        <BabyCareHighlight />
        <CategoryProductsSection
          id="babycare-products"
          title="Baby Care"
          subtitle="For Your Little Ones"
          products={babyCareProducts}
          bgClass="bg-muted/30"
        />
        
        <TrustSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
