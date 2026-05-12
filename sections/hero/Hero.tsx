"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* 1. Star & Subtle Gradient Background with Slow Zoom */}
      <div className="absolute inset-0 z-0 bg-transparent animate-slow-zoom">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)]" />
        
        {/* Subtle Star Pattern 1 */}
        <div 
           className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
             backgroundSize: "60px 60px" 
           }} 
        />
        {/* Subtle Star Pattern 2 (Gold tinted) */}
        <div 
           className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: "radial-gradient(rgba(212,175,55,0.6) 2px, transparent 2px)",
             backgroundSize: "110px 110px",
             backgroundPosition: "30px 30px"
           }} 
        />
      </div>
      
      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center px-6 md:p-8 text-center relative">
        
        {/* Decorative top element — like an iOS app icon feel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 md:mb-8"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-[28px] bg-gold/10 border border-gold/30 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.2)] animate-breathe">
            <span className="text-gold text-2xl md:text-3xl font-serif">ا</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
           className="relative inline-block overflow-hidden pb-4"
        >
          {/* Main Heading */}
           <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-gold glow tracking-widest uppercase relative z-10 px-2 md:px-4 leading-tight">
             The Legacy<br className="sm:hidden" /> Continues
           </h1>
           
           {/* Gold Light Sweep Animation over the text */}
           <div className="absolute top-0 -bottom-4 h-full w-[40%] z-20 block bg-gradient-to-r from-transparent via-gold/80 to-transparent pointer-events-none mix-blend-color-dodge opacity-60 animate-gold-sweep" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
          className="mt-4 md:mt-6 max-w-sm md:max-w-2xl text-[11px] sm:text-xs md:text-base text-foreground/50 tracking-widest uppercase leading-relaxed md:leading-loose px-4"
        >
          Discover the profound history, the people, and the enduring moments of our Khandaan.
        </motion.p>

        {/* iOS-style CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-8 sm:px-0"
        >
          <Link
            href="/family-tree"
            className="
              flex items-center justify-center gap-2
              py-3.5 px-8 
              bg-gold text-black 
              font-serif uppercase tracking-[0.15em] text-[11px] md:text-xs
              rounded-full
              shadow-[0_0_25px_rgba(212,175,55,0.3)]
              hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]
              hover:bg-gold/90
              active:scale-95
              transition-all duration-300
            "
          >
            Explore Family Tree
          </Link>
          <Link
            href="/timeline"
            className="
              flex items-center justify-center gap-2
              py-3.5 px-8 
              bg-transparent text-gold
              border border-gold/30
              font-serif uppercase tracking-[0.15em] text-[11px] md:text-xs
              rounded-full
              hover:bg-gold/10
              hover:border-gold/50
              active:scale-95
              transition-all duration-300
            "
          >
            View Timeline
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator - desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 md:bottom-12 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gold/40 to-transparent" />
      </motion.div>
    </section>
  );
}
