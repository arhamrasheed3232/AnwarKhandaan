"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects for Scrollytelling
  const yText = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useGSAP(() => {
    // Self-drawing SVG animation triggered by scroll
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll("path");
      
      gsap.set(paths, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom center",
          scrub: 1.5,
        }
      });
    }

    // Floating glass buttons
    gsap.to(".glass-btn", {
      y: -10,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* ─── Ambient Scrollytelling Background (SVG Self-Drawing) ─── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-15 pointer-events-none mix-blend-color-dodge">
        <svg ref={svgRef} width="800" height="800" viewBox="0 0 100 100" className="absolute w-[150vw] md:w-[100vw] h-auto max-w-none opacity-40">
          {/* Islamic Star Pattern Path */}
          <path 
            d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z M50 20 L65 35 L80 50 L65 65 L50 80 L35 65 L20 50 L35 35 Z" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="0.2" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="0.1" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-0 bg-transparent animate-slow-zoom">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.08)_0%,_transparent_60%)]" />
      </div>
      
      {/* ─── Content ─── */}
      <motion.div 
        style={{ y: yText, opacity: opacityText, scale: scaleText }}
        className="z-10 flex flex-col items-center justify-center px-6 md:p-8 text-center relative"
      >
        
        <motion.div
           initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
           className="relative inline-block overflow-visible pb-4"
        >
           <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-widest uppercase relative z-10 px-2 md:px-4 leading-tight font-light mix-blend-screen">
             The Legacy<br className="sm:hidden" /> <span className="text-gold italic glow font-medium">Continues</span>
           </h1>
           
           <div className="absolute top-0 -bottom-4 h-full w-[30%] z-20 block bg-gradient-to-r from-transparent via-gold/80 to-transparent pointer-events-none mix-blend-color-dodge opacity-70 animate-gold-sweep" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
          className="mt-6 md:mt-8 max-w-sm md:max-w-3xl text-xs sm:text-sm md:text-lg text-foreground/60 tracking-[0.3em] uppercase leading-relaxed px-4 font-light"
        >
          Discover the profound history, the people, and the enduring moments of our Khandaan.
        </motion.p>

        {/* Micro-interaction Glassmorphic Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-8 sm:px-0"
        >
          <Link
            href="/family-tree"
            className="
              glass-btn relative overflow-hidden
              flex items-center justify-center gap-2
              py-4 px-10 
              bg-gold/10 backdrop-blur-xl
              border border-gold/50
              text-gold 
              font-serif uppercase tracking-[0.2em] text-[11px] md:text-xs
              rounded-full
              shadow-[0_0_30px_rgba(212,175,55,0.2)]
              hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]
              hover:bg-gold/20
              hover:scale-105
              active:scale-95
              transition-all duration-500
              group
            "
          >
            <span className="relative z-10">Explore Tree</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-gold-sweep" />
          </Link>

          <Link
            href="/timeline"
            className="
              glass-btn relative overflow-hidden
              flex items-center justify-center gap-2
              py-4 px-10 
              bg-white/5 backdrop-blur-xl
              border border-white/20
              text-white
              font-serif uppercase tracking-[0.2em] text-[11px] md:text-xs
              rounded-full
              hover:bg-white/10
              hover:border-white/40
              hover:scale-105
              active:scale-95
              transition-all duration-500
              group
            "
          >
            <span className="relative z-10">View Timeline</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-gold-sweep" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-gold/60 font-light">Scroll to Discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent animate-pulse-gold" />
      </motion.div>
    </section>
  );
}
