import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
