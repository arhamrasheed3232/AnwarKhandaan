"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ChapterOne() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="chapter-1" ref={containerRef} className="relative min-h-[120vh] flex items-center justify-center bg-transparent px-6 py-32 overflow-hidden">
      {/* Parallax Background Depth */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_#d4af37_0%,_transparent_60%)]" />
      </motion.div>

      <div className="max-w-5xl mx-auto text-center z-10 relative">

        {/* Animated Subtitle */}
        <motion.h2
          initial={{ opacity: 0, letterSpacing: "0em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-sm md:text-2xl text-gold uppercase mb-8 font-semibold gold-glow"
        >
          Chapter I: The Foundation
        </motion.h2>

        {/* Animated Main Title with Blur Reveal */}
        <motion.h3
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-12 glow leading-tight"
        >
          Anwar Ali <span className="text-gold italic font-medium">&</span> Iltifatunisa
        </motion.h3>

        {/* Animated Body Paragraphs */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-lg md:text-3xl text-foreground/80 leading-relaxed font-light mb-10 max-w-4xl mx-auto"
        >
          Every great legacy begins with a single seed. Anwar Ali planted the roots of our Khandaan alongside his beloved wife, Iltifatunisa, standing resilient against the shifting sands of time.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-base md:text-xl text-foreground/50 leading-relaxed font-light italic max-w-3xl mx-auto"
        >
          Together, they built a home, raised their seven children, and established the sacred traditions that flow in our bloodline today. The atmosphere of their era shaped the values we carry into the future.
        </motion.p>

        {/* The Animated Bounding Line (Roots growing) */}
        <div className="flex flex-col items-center mt-24 relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: 140 }}
            transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-[2px] bg-gradient-to-b from-gold to-transparent mb-10"
          />

          <motion.h4
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 3 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs text-gold/70 uppercase tracking-[0.4em] font-bold mb-8"
          >
            The First Branches
          </motion.h4>

          {/* Staggered Children Reveal */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2, delayChildren: 3.5 } }
            }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm md:text-lg text-foreground/70 uppercase tracking-[0.2em] font-medium max-w-4xl"
          >
            {["Mohd Rasheed", "Mohammad Mujeeb", "Ayaz", "Wasiqunnisa", "Naseer", "Saeed", "Habibunisa"].map((child, idx) => (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8 } }
                }}
                className="hover:text-gold hover:gold-glow transition-all duration-300 cursor-default"
              >
                {child}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
