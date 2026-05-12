"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── 3D Mandala Component ─────────────────────────────────────────────
function IslamicMandala({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Rotate the entire mandala slowly
    groupRef.current.rotation.z = t * 0.1;
    
    // Zoom past the camera at the end
    if (progress > 0.85) {
      const zoomFactor = (progress - 0.85) * 50; // Rapid scale up
      groupRef.current.scale.setScalar(1 + zoomFactor * zoomFactor);
    }
  });

  // Calculate opacity based on progress
  const opacity = progress < 0.3 ? 0 : progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) * 10) : 1;

  // Create an 8-pointed star layer (Rub el Hizb)
  const StarLayer = ({ radius, speed, reverse }: { radius: number, speed: number, reverse?: boolean }) => {
    const layerRef = useRef<THREE.Group>(null);
    
    useFrame(({ clock }) => {
      if (!layerRef.current) return;
      layerRef.current.rotation.z = clock.getElapsedTime() * speed * (reverse ? -1 : 1);
    });

    // We use a cylinder geometry with 4 segments to make a square tube
    return (
      <group ref={layerRef}>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[radius * 0.95, radius, 4]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={opacity * 0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[radius * 0.95, radius, 4]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={opacity * 0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner detail ring */}
        <mesh>
          <ringGeometry args={[radius * 0.98, radius * 0.99, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.8} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef} scale={progress < 0.4 ? progress * 2.5 : 1}>
      {/* Central light burst */}
      <mesh>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>
      
      <StarLayer radius={2} speed={0.2} />
      <StarLayer radius={4} speed={0.15} reverse />
      <StarLayer radius={6} speed={0.1} />
      <StarLayer radius={8} speed={0.05} reverse />
      <StarLayer radius={12} speed={0.02} />
    </group>
  );
}

// ─── Light Beam Component ─────────────────────────────────────────────
function LightBeam({ progress }: { progress: number }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!beamRef.current) return;
    // Fade out beam when mandala appears
    if (progress > 0.4) {
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - (progress - 0.4) * 5);
    }
  });

  // Only show between 0.1 and 0.5
  const visible = progress > 0.1 && progress < 0.5;

  return (
    <mesh ref={beamRef} visible={visible} position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.1, 4, 40, 32, 1, true]} />
      <meshBasicMaterial 
        color="#d4af37" 
        transparent 
        opacity={0.8} 
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Main Intro Component ─────────────────────────────────────────────
export default function IntroCinematic({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling while intro plays
    document.body.style.overflow = 'hidden';
    
    const startTime = Date.now();
    const duration = 12000; // 12 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / duration, 1);
      setProgress(currentProgress);

      if (currentProgress < 0.15) setPhase(1); // "Light upon light"
      else if (currentProgress < 0.4) setPhase(2); // Beam comes down
      else if (currentProgress < 0.7) setPhase(3); // Mandala expands, "Made into nations..."
      else if (currentProgress < 0.9) setPhase(4); // "...so that we may know one another"
      else if (currentProgress >= 1) {
        clearInterval(interval);
        document.body.style.overflow = 'auto';
        onComplete();
      }
    }, 16);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <color attach="background" args={["#000000"]} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          
          <LightBeam progress={progress} />
          <IslamicMandala progress={progress} />
        </Canvas>
      </div>

      {/* Cinematic Text Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.h2
              key="phase1"
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 1.5 }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif text-gold glow tracking-widest uppercase leading-loose"
            >
              "Light upon light."
            </motion.h2>
          )}

          {phase === 3 && (
            <motion.h2
              key="phase3"
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 1.5 }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif text-white tracking-[0.15em] uppercase leading-relaxed shadow-black drop-shadow-2xl"
            >
              Made into nations and tribes...
            </motion.h2>
          )}

          {phase === 4 && (
            <motion.h2
              key="phase4"
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 1.5 }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif text-gold glow tracking-[0.15em] uppercase leading-relaxed"
            >
              ...so that we may know one another.
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* Final White/Gold Flash transition */}
      <motion.div 
        className="absolute inset-0 bg-gold pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.9 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
}
