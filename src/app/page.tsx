import Hero from "@/components/Hero";
import SeasonalBanner from "@/components/SeasonalBanner";
import BestPieces from "@/components/BestPieces";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <SeasonalBanner />
      <BestPieces />
      <Collections />
      <Footer />
    </main>
  );
}
