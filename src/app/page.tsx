import Hero from "@/components/Hero";
import HomeNavWrapper from "@/components/HomeNavWrapper";
import SeasonalBanner from "@/components/SeasonalBanner";
import BestPieces from "@/components/BestPieces";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  return (
    <main id="main-content">
      <LoadingScreen />
      <HomeNavWrapper />
      <Hero />
      <SeasonalBanner />
      <BestPieces />
      <Collections />
      <Footer />
    </main>
  );
}
