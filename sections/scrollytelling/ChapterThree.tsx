"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const quotes = [
  {
    name: "Taiba Maryam",
    role: "The Nurturer",
    text: "I find purpose in teaching them values, knowledge, and strength... My life revolves around love, faith, and the desire to build a family grounded in both worldly achievement and spiritual fulfillment.",
    speed: "0.1"
  },
  {
    name: "Arham Rasheed",
    role: "The First CS Engineer",
    text: "I am the proud grandson of two brothers... whose patience, strength, and struggles built the foundation of our Khaandaan.",
    speed: "-0.15"
  },
  {
    name: "Kaab Anwer",
    role: "The Future Healer",
    text: "People say that I am very similar to my grandfather which is a huge compliment for me. Inshallah I hope to become like him.",
    speed: "0.08"
  },
  {
    name: "Mohd Arshad",
    role: "The Compassionate",
    text: "Mae dil k bhttt achha hu or hr insaan ki burae ko ansuna andekha kr deta hu.",
    speed: "-0.1"
  },
  {
    name: "Amina Khatoon",
    role: "The Peacemaker",
    text: "I have a positive attitude and personality, and I always try to care for the happiness of everyone around me.",
    speed: "0.12"
  }
];

export default function ChapterThree() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="chapter-3" ref={containerRef} className="relative min-h-[150vh] py-32 px-6 bg-[#020202] overflow-hidden">
      {/* Deep Space Background for Contrast */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_bottom,_#ffffff_0%,_transparent_70%)]" />
      </motion.div>

      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, tracking: "0em" }}
            whileInView={{ opacity: 1, tracking: "0.4em" }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs md:text-sm text-gold uppercase mb-6 font-light"
          >
            Chapter III: The Living Spirit
          </motion.h2>
          
          <motion.h3 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-serif text-white glow leading-tight mb-8"
          >
            Voices of the Khandaan
          </motion.h3>

          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 80 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="w-[1px] bg-gradient-to-b from-gold/80 to-transparent mx-auto"
          />
        </div>

        {/* Masonry-style Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative pt-10">
          {quotes.map((quote, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: (idx % 3) * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              data-speed={quote.speed}
              className={`relative p-8 md:p-10 rounded-3xl bg-[#080808]/50 backdrop-blur-md border border-white/5 hover:border-gold/30 transition-colors duration-700 group flex flex-col ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              <p className="text-sm md:text-lg text-foreground/80 leading-relaxed font-light italic flex-grow mb-10 mt-4">
                "{quote.text}"
              </p>
              
              <div className="mt-auto">
                <div className="h-[1px] w-12 bg-gold/50 mb-4" />
                <h4 className="text-xl font-serif text-gold group-hover:scale-105 transition-transform origin-left duration-500">
                  {quote.name}
                </h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mt-1">
                  {quote.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
