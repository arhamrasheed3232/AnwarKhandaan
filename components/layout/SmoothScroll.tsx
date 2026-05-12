"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register ScrollTrigger to GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    function update(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // Turn off lag smoothing in GSAP to avoid jitter with Lenis
    gsap.ticker.lagSmoothing(0);

    // Phase 8: Global GSAP Parallax Hook
    const parallaxElements = gsap.utils.toArray("[data-speed]") as HTMLElement[];
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-speed") || "0.2");
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => window.innerHeight * speed, // Dynamic window delta mapping
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
