import Header from "@/components/shop/Header";
import HeroBanner from "@/components/shop/HeroBanner";
import CategorySection from "@/components/shop/CategorySection";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <HeroBanner />
    <CategorySection />
    <ShopFooter />
  </div>
);

export default Index;
