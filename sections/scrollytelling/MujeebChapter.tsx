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
  if (lower.includes("kind") || name.includes("Anas")) return "The Kind Soul";
  return "The Next Generation";
};

const mujeeb = familyData.members.find(m => m.id === "mujeeb");
const mujeebChildren = (mujeeb?.children || []).map(childId => {
  const child = familyData.members.find(m => m.id === childId);
  return {
    name: child?.name || childId,
    bio: child?.bio || "Carrying forward the family legacy.",
    trait: getTrait(child?.name || "", child?.bio || "")
  };
});

export default function MujeebChapter() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section id="chapter-4" ref={containerRef} className="relative min-h-[200vh] py-32 px-6 bg-transparent overflow-hidden flex flex-col items-center">
      
      {/* Background Depth */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center_left,_#d4af37_0%,_transparent_60%)]" />
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
          Chapter IV: The Second Branch
        </motion.h2>
        
        {/* Animated Main Title */}
        <motion.h3 
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-5xl md:text-7xl font-serif text-white mb-8 glow leading-tight"
        >
          Mohammad Mujeeb
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-white/70 italic mb-10 font-serif"
        >
          & Qamar Jahan
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-sm md:text-lg text-foreground/60 leading-relaxed font-light max-w-3xl mx-auto"
        >
          A vibrant and large lineage defined by profound love, patience, and humor. Mohammad Mujeeb and Qamar Jahan fostered a household where emotional depth met enduring optimism, passing down a legacy of vibrant personalities and unshakeable faith.
        </motion.p>
      </div>

      {/* The Descendants Vertical Timeline */}
      <div className="max-w-4xl mx-auto z-10 relative w-full mt-10">
        
        {mujeebChildren.map((child, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse text-right'}`}
          >
            {/* The Connecting Line / Node */}
            <div className="hidden md:flex flex-col items-center justify-center relative">
              <div className="w-px h-full absolute bg-gold/20 -z-10" />
              <div className="w-4 h-4 rounded-full bg-[#050505] border-2 border-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            </div>

            {/* Content Card */}
            <div className={`flex-1 p-8 rounded-3xl bg-[#080808]/50 backdrop-blur-md border border-white/5 hover:border-gold/30 transition-all duration-500 shadow-xl group ${idx % 2 === 0 ? 'text-left' : 'md:text-right text-left'}`}>
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
