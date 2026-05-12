"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            }
          }
        }}
      >
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.8, ease: "easeOut" } 
              }
            }}
            data-speed={index % 2 === 0 ? "0.05" : "-0.05"}
            className="group relative overflow-hidden rounded-xl auto-float bg-black cursor-pointer border border-foreground/10 hover:border-gold/50 transition-colors shadow-lg"
            onClick={() => setSelectedImage(img)}
          >
            <div className="aspect-square relative w-full h-full min-h-[350px]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-gold font-serif text-2xl glow">{img.caption}</p>
                <div className="w-12 h-[2px] bg-gold mt-3 opacity-70" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-lg"
            onClick={() => setSelectedImage(null)}
          >
            <button
               onClick={() => setSelectedImage(null)}
               className="absolute top-8 right-8 text-foreground/50 hover:text-gold transition-colors text-4xl font-light z-10"
               aria-label="Close modal"
            >
               ✕
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-h-[80vh] max-w-[80vw] flex flex-col items-center justify-center"
            >
              <div className="relative w-full h-full border rounded-xl border-gold/30 overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.2)] bg-[#050505]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-8 text-2xl md:text-3xl font-serif text-gold glow uppercase tracking-widest text-center">
                {selectedImage.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
