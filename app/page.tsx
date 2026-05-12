"use client";

import { useState, useEffect } from "react";
import Hero from "@/sections/hero/Hero";
import IntroCinematic from "@/components/intro/IntroCinematic";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("khandaan_intro_played");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("khandaan_intro_played", "true");
    setShowIntro(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <AnimatePresence>
        {showIntro && <IntroCinematic key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>
      
      {/* Hide hero slightly until intro finishes to prevent scrollbar flicker */}
      <div className={`w-full transition-opacity duration-1000 ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <Hero />
      </div>
    </main>
  );
}
