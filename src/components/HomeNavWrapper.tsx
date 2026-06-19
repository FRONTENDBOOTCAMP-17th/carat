"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function HomeNavWrapper() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const handler = () => setRevealed(true);
    window.addEventListener("prisme:nav-reveal", handler);
    return () => window.removeEventListener("prisme:nav-reveal", handler);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ${
        revealed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <Navbar />
    </div>
  );
}
