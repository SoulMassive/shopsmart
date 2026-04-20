import Header from "@/components/shop/Header";
import HeroBanner from "@/components/shop/HeroBanner";
import AboutSection from "@/components/shop/AboutSection";
import CategorySection from "@/components/shop/CategorySection";
import VisionMissionSection from "@/components/shop/VisionMissionSection";
import WhyShopSmartSection from "@/components/shop/WhyShopSmartSection";
import BenefitsSection from "@/components/shop/BenefitsSection";
import ExtraPerksSection from "@/components/shop/ExtraPerksSection";
import CommunityImpactSection from "@/components/shop/CommunityImpactSection";
import ContactSection from "@/components/shop/ContactSection";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main className="flex-grow">
      <HeroBanner />
      <AboutSection />
      <CategorySection />
      <VisionMissionSection />
      <WhyShopSmartSection />
      <BenefitsSection />
      <ExtraPerksSection />
      <CommunityImpactSection />
    </main>
    <ContactSection />
    <ShopFooter />
  </div>
);

export default Index;
