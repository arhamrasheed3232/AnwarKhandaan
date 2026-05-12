"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, MeshTransmissionMaterial, Float, Environment, Text } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── 3D Ultra-Premium Glass Mandala ─────────────────────────────────────────────
function GlassIslamicStar({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Liquid, smooth continuous rotation
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.5 + t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    groupRef.current.rotation.y = Math.cos(t * 0.2) * 0.2;

    // Pulsing glowing core
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
    
    // Dramatic zoom explosion at the end
    if (progress > 0.85) {
      const zoomFactor = (progress - 0.85) * 60; 
      groupRef.current.scale.setScalar(1 + Math.pow(zoomFactor, 3));
    }
  });

  const opacity = progress < 0.2 ? progress * 5 : progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) * 10) : 1;

  return (
    <group ref={groupRef} scale={progress < 0.3 ? Math.pow(progress * 3.33, 2) : 1}>
      
      {/* The Core Light */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshBasicMaterial color="#ffdc73" transparent opacity={opacity} />
      </mesh>

      {/* Glass Layer 1 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[2, 0.4, 32, 4]} />
          <MeshTransmissionMaterial 
            backside
            thickness={1.5}
            roughness={0.05}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.3}
            color="#ffffff"
            transparent
            opacity={opacity}
          />
        </mesh>
      </Float>

      {/* Glass Layer 2 (Rotated to form 8-point star) */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.5}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[2, 0.4, 32, 4]} />
          <MeshTransmissionMaterial 
            backside
            thickness={2}
            roughness={0.02}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.1}
            color="#f7e1a3"
            transparent
            opacity={opacity}
          />
        </mesh>
      </Float>

      {/* Outer Golden Ring */}
      <mesh>
        <torusGeometry args={[3.5, 0.05, 16, 64]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2} transparent opacity={opacity * 0.6} />
      </mesh>
    </group>
  );
}

// ─── Ambient Particles ─────────────────────────────────────────────
function AmbientDust({ count = 200 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 0.2 + Math.random() * 0.8,
        speed: 0.01 + Math.random() * 0.015,
        xFactor: -20 + Math.random() * 40,
        yFactor: -20 + Math.random() * 40,
        zFactor: -20 + Math.random() * 40,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.xFactor / 2) + a * 5,
        (particle.yFactor / 2) + b * 5,
        (particle.zFactor / 2) + b * 2
      );
      dummy.scale.setScalar(s * factor * 0.1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color="#d4af37" transparent opacity={0.4} />
    </instancedMesh>
  );
}

// ─── Main Intro Component ─────────────────────────────────────────────
export default function IntroCinematic({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const startTime = Date.now();
    const duration = 12000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / duration, 1);
      setProgress(currentProgress);

      if (currentProgress < 0.15) setPhase(1);
      else if (currentProgress < 0.45) setPhase(2);
      else if (currentProgress < 0.8) setPhase(3);
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
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#020202] flex items-center justify-center"
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <color attach="background" args={["#010101"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#d4af37" />
          
          <Environment preset="city" />
          
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={1} />
          <AmbientDust count={150} />
          <GlassIslamicStar progress={progress} />

          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.5} 
              mipmapBlur 
              intensity={1.5} 
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.002, 0.002)}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Cinematic Text Overlay - Typographic Excellence */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pointer-events-none flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} // Exponetial easing
            >
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white uppercase tracking-[0.3em] font-light">
                Light <span className="text-gold italic glow">Upon</span> Light
              </h2>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(15px)" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-xl md:text-3xl lg:text-5xl font-serif text-white tracking-[0.2em] uppercase font-light leading-relaxed drop-shadow-2xl">
                Made into nations and tribes
              </h2>
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif text-gold glow tracking-[0.2em] uppercase font-light leading-relaxed">
                So that we may <span className="text-white italic">know</span> one another.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        className="absolute inset-0 bg-[#020202] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.9 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "circIn" }}
      />
    </motion.div>
  );
}
