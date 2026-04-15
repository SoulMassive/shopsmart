import Header from "@/components/shop/Header";
import HeroBanner from "@/components/shop/HeroBanner";
import AboutSection from "@/components/shop/AboutSection";
import CategorySection from "@/components/shop/CategorySection";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <HeroBanner />
    <AboutSection />
    <CategorySection />
    <ShopFooter />
  </div>
);

export default Index;
