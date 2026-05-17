"use client";

import { motion } from "framer-motion";

export default function ChapterNav() {
  const chapters = [
    { id: "hero", title: "Prologue" },
    { id: "chapter-1", title: "I. Foundation" },
    { id: "chapter-2", title: "II. Expansion" },
    { id: "chapter-3", title: "III. Rasheed" },
    { id: "chapter-4", title: "IV. Mujeeb" },
    { id: "chapter-5", title: "V. Ayaz" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 1 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-6"
    >
      {chapters.map((chapter, i) => (
        <button 
          key={i}
          onClick={() => scrollTo(chapter.id)}
          className="group relative flex items-center justify-end w-4 h-4 cursor-pointer"
        >
          {/* Tooltip */}
          <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] uppercase tracking-[0.2em] text-gold whitespace-nowrap bg-black/60 px-2 py-1 rounded border border-gold/20 backdrop-blur-md">
            {chapter.title}
          </span>
          {/* Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-gold transition-all duration-300 group-hover:scale-[2]" />
        </button>
      ))}
    </motion.div>
  );
}
