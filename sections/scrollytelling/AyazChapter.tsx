"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import familyData from "@/data/family.json";

const getTrait = (name: string, bio: string = "") => {
  const lower = bio.toLowerCase();
  if (lower.includes("kind heart") || name.includes("Arshad")) return "The Compassionate Heart";
  if (lower.includes("khidmat") || name.includes("Nazmi")) return "The Selfless Caregiver";
  if (lower.includes("gravies") || name.includes("Hashmi")) return "The Culinary Master";
  if (lower.includes("jannah") || name.includes("Saira")) return "The Guardian of Grace";
  if (lower.includes("positive") || name.includes("Amina")) return "The Radiant Optimist";
  if (lower.includes("gussay") || name.includes("Mohsin")) return "The Passionate Soul";
  if (lower.includes("patient") || name.includes("Monis")) return "The Anchor of Calm";
  if (lower.includes("entertain") || name.includes("Mariya")) return "The Joyful Spirit";
  if (lower.includes("allah") || name.includes("Razia")) return "The Honest Heart";
  if (lower.includes("jannati") || name.includes("Fozia")) return "The Blessed One";
  if (lower.includes("kind") || name.includes("Anas")) return "The Steadfast Heir";
  return "The Next Generation";
};

const ayaz = familyData.members.find(m => m.id === "ayaz");
const ayazChildren = (ayaz?.children || []).map(childId => {
  const child = familyData.members.find(m => m.id === childId);
  return {
    name: child?.name || childId,
    bio: child?.bio || "Carrying forward the family legacy.",
    trait: getTrait(child?.name || "", child?.bio || "")
  };
});

export default function AyazChapter() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section id="chapter-5" ref={containerRef} className="relative min-h-[120vh] py-32 px-6 bg-transparent overflow-hidden flex flex-col items-center">
      
      {/* Background Depth */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_bottom_right,_#d4af37_0%,_transparent_60%)]" />
      </motion.div>

      <div className="max-w-5xl mx-auto z-10 relative w-full text-center mb-24">
        
        {/* Animated Subtitle */}
        <motion.h2 
          initial={{ opacity: 0, letterSpacing: "0em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-sm md:text-2xl text-gold uppercase mb-6 font-semibold gold-glow"
        >
          Chapter V: The Third Branch
        </motion.h2>
        
        {/* Animated Main Title */}
        <motion.h3 
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-5xl md:text-7xl font-serif text-white mb-8 glow leading-tight"
        >
          Ayaz
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-white/70 italic mb-10 font-serif"
        >
          & Nazira Bano
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-sm md:text-lg text-foreground/60 leading-relaxed font-light max-w-3xl mx-auto"
        >
          A lineage of focus, quiet strength, and unwavering dedication. Ayaz and Nazira Bano cultivated a deeply resolute branch of the Khandaan, carrying forward the family's honor through deliberate action and steadfast values.
        </motion.p>
      </div>

      {/* The Descendants Vertical Timeline */}
      <div className="max-w-4xl mx-auto z-10 relative w-full mt-10">
        
        {ayazChildren.map((child, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col md:flex-row items-center gap-8 mb-20 text-center mx-auto w-full justify-center`}
          >

            {/* Content Card */}
            <div className={`w-full max-w-lg p-8 rounded-3xl bg-[#080808]/50 backdrop-blur-md border border-white/5 hover:border-gold/30 transition-all duration-500 shadow-xl group`}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold mb-3">
                {child.trait}
              </p>
              <h4 className="text-3xl font-serif text-white mb-4 group-hover:text-gold transition-colors duration-500">
                {child.name}
              </h4>
              <p className="text-sm md:text-base text-foreground/70 font-light italic leading-relaxed">
                "{child.bio}"
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
