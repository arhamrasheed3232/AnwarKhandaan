"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const households = [
  {
    patriarch: "Mohd Rasheed",
    matriarch: "Sayyada Khatoon",
    children: ["Arshad", "Nazmi", "Hashmi", "Saira"],
    desc: "A household deeply rooted in compassion and care, nurturing a lineage defined by selfless service and culinary traditions.",
  },
  {
    patriarch: "Mohammad Mujeeb",
    matriarch: "Qamar Jahan",
    children: ["Mohsin", "Amina", "Monis", "Mariya", "Razia", "Fozia"],
    desc: "A large, vibrant branch carrying forward the warmth, diverse personalities, and deep traditions of the Khandaan.",
  },
  {
    patriarch: "Ayaz",
    matriarch: "Nazira Bano",
    children: ["Anas"],
    desc: "A focused and resilient lineage, representing the quiet strength and unwavering dedication of the family.",
  }
];

export default function ChapterTwo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section id="chapter-2" ref={containerRef} className="relative min-h-screen py-32 px-6 bg-transparent overflow-hidden flex flex-col justify-center">
      {/* Background Depth */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#d4af37_0%,_transparent_50%)] opacity-[0.03]" />
      </motion.div>

      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, letterSpacing: "0em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-sm md:text-2xl text-gold uppercase mb-6 font-semibold gold-glow"
          >
            Chapter II: The Great Expansion
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-serif text-white glow leading-tight"
          >
            The Three Pillars
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-6 text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed"
          >
            As time moved forward, the singular root planted by Anwar and Iltifatunisa expanded into powerful new branches. The sons formed the three core pillars of the modern family.
          </motion.p>
        </div>

        {/* Masonry Layout for Households */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {households.map((household, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: idx * 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative p-8 lg:p-10 rounded-3xl bg-[#080808]/50 backdrop-blur-md border border-white/5 hover:border-gold/30 transition-all duration-700 group hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col items-center text-center"
            >
              {/* Subtle top accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <h4 className="text-2xl lg:text-3xl font-serif text-white mb-2 group-hover:text-gold transition-colors duration-500">
                {household.patriarch}
              </h4>
              <p className="text-sm text-gold/70 italic mb-6">
                & {household.matriarch}
              </p>

              <p className="text-sm text-foreground/60 leading-relaxed font-light mb-8 flex-grow">
                "{household.desc}"
              </p>

              <div className="w-full pt-6 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">
                  The Descendants
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {household.children.map((child, cIdx) => (
                    <span key={cIdx} className="text-xs text-foreground/80 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {child}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
