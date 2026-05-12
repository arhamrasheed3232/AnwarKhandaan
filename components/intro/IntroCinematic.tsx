"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── Constants ─────────────────────────────────────────────
const PARTICLE_COUNT = 800;
const DURATION = 28000; // 28 seconds

// ─── Cinematic Particle Morphing System ─────────────────────────────────────────────
function EvolutionParticles({ phase, progress }: { phase: number, progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const earthRef = useRef<THREE.Mesh>(null);

  // Pre-calculate target positions for each phase
  const targetPositions = useMemo(() => {
    const sphere = [];
    const dna = [];
    const constellation = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 1. Sphere Orbit (Earth ring)
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 3 + Math.random() * 1.5; // orbit radius
      sphere.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));

      // 2. DNA Helix (Human Evolution)
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const t = (i / PARTICLE_COUNT) * Math.PI * 10 - 15; 
      dna.push(new THREE.Vector3(
        Math.sin(t + strand) * 2,
        t * 1.5,
        Math.cos(t + strand) * 2
      ));

      // 3. Constellation (Khandaan)
      const cx = (Math.random() - 0.5) * 30;
      const cy = (Math.random() - 0.5) * 30;
      const cz = (Math.random() - 0.5) * 10 - 5;
      constellation.push(new THREE.Vector3(cx, cy, cz));
    }
    return { sphere, dna, constellation };
  }, []);

  // Store current positions for smooth lerping
  const currentPositions = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => new THREE.Vector3(0, 0, 0));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    // Determine target based on phase
    let target = targetPositions.sphere;
    if (phase >= 3) target = targetPositions.dna;
    if (phase >= 4) target = targetPositions.constellation;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const cur = currentPositions[i];
      const tar = target[i];

      // Lerp current position to target position
      cur.lerp(tar, 0.03); // Smooth transition speed

      // Add dynamic ambient motion based on phase
      if (phase === 2) {
        // Revolving power around earth
        const angle = time * 2 + i * 0.01;
        cur.x = Math.cos(angle) * tar.x - Math.sin(angle) * tar.z;
        cur.z = Math.sin(angle) * tar.x + Math.cos(angle) * tar.z;
      } else if (phase === 3) {
        // DNA rotating
        cur.x += Math.sin(time + cur.y) * 0.02;
        cur.z += Math.cos(time + cur.y) * 0.02;
      } else if (phase === 4) {
        // Constellation floating
        cur.y += Math.sin(time + i) * 0.01;
        
        // Massive explosion towards camera at the very end
        if (progress > 0.9) {
          const explosion = (progress - 0.9) * 10;
          cur.z += explosion * (i % 2 === 0 ? 1 : -1) * 5;
        }
      }

      dummy.position.copy(cur);
      
      // Variable scale
      const scale = phase === 2 ? 0.05 : phase === 3 ? 0.08 : 0.15;
      dummy.scale.setScalar(scale + Math.sin(time * 3 + i) * 0.02);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Smoothly fade in particles ONLY after Ayah (phase > 1)
    if (meshRef.current.material) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (phase === 1) {
        mat.opacity = 0;
      } else {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.8, 0.05);
      }
    }

    // Rotate Earth if visible
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group>
      {/* Central stylized Earth (Only visible in phase 2) */}
      <mesh ref={earthRef} visible={phase === 2} scale={2}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Instanced Particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#ffdc73" transparent opacity={0.8} />
      </instancedMesh>
    </group>
  );
}

// ─── Main Cinematic Component ─────────────────────────────────────────────
export default function IntroCinematic({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / DURATION, 1);
      setProgress(currentProgress);

      if (currentProgress < 0.30) setPhase(1); // Ayah (0-8.4s)
      else if (currentProgress < 0.55) setPhase(2); // Earth & Power (8.4-15.4s)
      else if (currentProgress < 0.75) setPhase(3); // Evolution/DNA (15.4-21s)
      else if (currentProgress < 0.95) setPhase(4); // Khandaan Constellation (21-26.6s)
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
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <color attach="background" args={["#010101"]} />
          <ambientLight intensity={0.5} />
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={1} />
          
          <EvolutionParticles phase={phase} progress={progress} />

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.003, 0.003)} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Cinematic Text Overlay */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pointer-events-none flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          
          {/* Phase 1: The Ayah */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl text-gold font-serif leading-relaxed drop-shadow-2xl text-center" style={{ direction: 'rtl' }}>
                يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ<br/>وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا
              </h1>
              <p className="text-white/70 text-sm md:text-base tracking-[0.2em] uppercase max-w-2xl mx-auto mt-4 font-light">
                "O mankind, We have created you from male and female and made you peoples and tribes that you may know one another."
              </p>
            </motion.div>
          )}

          {/* Phase 2: Earth & Power */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(15px)" }}
              transition={{ duration: 2 }}
            >
              <h2 className="text-xl md:text-3xl lg:text-5xl font-serif text-white tracking-[0.2em] uppercase font-light leading-relaxed drop-shadow-2xl">
                From the Earth we were formed...
              </h2>
            </motion.div>
          )}

          {/* Phase 3: Evolution / DNA */}
          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 2 }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif text-gold glow tracking-[0.2em] uppercase font-light leading-relaxed">
                ...through generations we <span className="text-white italic">evolved</span>...
              </h2>
            </motion.div>
          )}

          {/* Phase 4: Khandaan */}
          {phase === 4 && progress < 0.95 && (
            <motion.div
              key="phase4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.5 }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(212,175,55,1)]">
                To become the <br/>
                <span className="text-gold italic">Anwar Khandaan</span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        className="absolute inset-0 bg-[#020202] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.95 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "circIn" }}
      />
    </motion.div>
  );
}
