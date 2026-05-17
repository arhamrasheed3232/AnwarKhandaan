"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function SpaceBackground() {
  const { scrollY } = useScroll();
  
  // Parallax effects for the planets so they float upwards as you scroll downwards
  const yPlanet1 = useTransform(scrollY, [0, 10000], [0, -1200]);
  const yPlanet2 = useTransform(scrollY, [0, 10000], [0, -2000]);
  const yStars = useTransform(scrollY, [0, 10000], [0, -400]); // slow star drift

  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden pointer-events-none">
      
      {/* ─── Static Stars Layer (Repeating CSS Pattern) ─── */}
      <motion.div 
        style={{ y: yStars }}
        className="absolute -inset-[100%] opacity-70"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20px 30px, #ffffff 1px, transparent 1.5px),
              radial-gradient(circle at 40px 70px, rgba(255,255,255,0.8) 1.5px, transparent 2px),
              radial-gradient(circle at 50px 160px, #ffffff 1px, transparent 1.5px),
              radial-gradient(circle at 90px 40px, rgba(212,175,55,0.8) 2px, transparent 2.5px),
              radial-gradient(circle at 130px 80px, #ffffff 1.5px, transparent 2px),
              radial-gradient(circle at 160px 120px, rgba(212,175,55,0.9) 1px, transparent 1.5px)
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10px 10px, #ffffff 1px, transparent 1.5px),
              radial-gradient(circle at 150px 150px, rgba(212,175,55,0.5) 1.5px, transparent 2px),
              radial-gradient(circle at 250px 50px, #ffffff 2px, transparent 2.5px)
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
          }}
        />
      </motion.div>

      {/* ─── Giant Dark Planets (Space Aesthetic) ─── */}
      
      {/* Planet 1 - Subtle Gold Atmospheric Giant */}
      <motion.div 
        className="absolute -bottom-[10vh] -left-[15vw] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-50"
        style={{ 
          y: yPlanet1,
          background: "radial-gradient(circle at 70% 30%, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,1) 100%)",
          boxShadow: "inset -20px -20px 100px rgba(212,175,55,0.03)"
        }}
      />
      
      {/* Planet 2 - Deep Space Eclipse */}
      <motion.div 
        className="absolute top-[50vh] -right-[15vw] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-40"
        style={{ 
          y: yPlanet2,
          background: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,1) 100%)",
          boxShadow: "inset 10px 10px 50px rgba(255,255,255,0.02)"
        }}
      />

      {/* Subtle Space Dust / Vignette to keep edges dark */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none opacity-90" />
    </div>
  );
}
