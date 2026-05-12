"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
    const line = document.querySelector(".timeline-line");

    // Line drawing animation
    gsap.fromTo(
      line,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      }
    );

    cards.forEach((card, i) => {
      const isLeft = i % 2 === 0;
      gsap.fromTo(
        card,
        {
          // On mobile, slide up instead of left/right
          x: window.innerWidth < 768 ? 0 : (isLeft ? -80 : 80),
          y: window.innerWidth < 768 ? 40 : 0,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef, dependencies: [events] });

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto py-16 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* Timeline vertical line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gold/10 md:-translate-x-1/2" />
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gold md:-translate-x-1/2 timeline-line origin-top" />

      <div className="relative z-10 flex flex-col gap-10 md:gap-32">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={index}
              className={`timeline-card flex flex-col md:flex-row items-start md:items-center w-full ${
                isLeft ? "md:justify-start" : "md:justify-end"
              } pl-12 md:pl-0`}
            >
              {/* Timeline node dot */}
              <div className="absolute left-6 md:left-1/2 w-3 h-3 md:w-5 md:h-5 bg-[#030303] border-2 border-gold rounded-full -translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.8)] md:shadow-[0_0_20px_rgba(212,175,55,1)] z-20 timeline-node" />

              <div
                className={`w-full md:w-5/12 ${
                  isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                }`}
              >
                <div className="
                  p-6 md:p-10 
                  rounded-2xl md:rounded-3xl 
                  auto-float 
                  bg-[#030303]/60 backdrop-blur-2xl 
                  border border-gold/10 hover:border-gold/30
                  transition-all duration-700 
                  shadow-[0_8px_30px_rgba(0,0,0,0.4)] 
                  group relative overflow-hidden 
                  text-left md:text-inherit
                  hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]
                  active:scale-[0.98]
                ">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Year */}
                  <h3 className="text-3xl md:text-6xl font-serif text-gold gold-glow mb-3 md:mb-6 group-hover:scale-[1.03] transition-transform origin-left md:origin-right duration-700 ease-out">
                    {event.year}
                  </h3>
                  
                  {/* Title */}
                  <h4 className="text-base md:text-2xl font-medium tracking-wider md:tracking-widest uppercase mb-2 md:mb-4 text-foreground/90 group-hover:text-gold transition-colors duration-500 leading-snug">
                    {event.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm md:text-base text-foreground/60 leading-relaxed font-light">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
