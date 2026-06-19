import Hero from "@/components/Hero";
import HomeNavWrapper from "@/components/HomeNavWrapper";
import SeasonalBanner from "@/components/SeasonalBanner";
import BestPieces from "@/components/BestPieces";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content">
      <HomeNavWrapper />
      <Hero />
      <SeasonalBanner />
      <BestPieces />
      <Collections />
      <Footer />
    </main>
  );
}
