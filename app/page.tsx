import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PartnersSlider } from "@/components/partners-slider";
import { ServicesSection } from "@/components/services-section";
import { AboutSection } from "@/components/about-section";
import { AdvantagesSection } from "@/components/advantages-section";
import { ContactSection } from "@/components/contact-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PartnersSlider />
        <AboutSection />
        <ServicesSection />
        <AdvantagesSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
