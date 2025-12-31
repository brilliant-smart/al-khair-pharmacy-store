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
  superstoreProducts,
  pharmacyProducts,
  electronicsProducts,
  textilesProducts,
  babyCareProducts,
} from "@/data/products";

const Index = () => {
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
