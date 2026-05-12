"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { login } from "@/app/actions/auth";
import authConfig from "@/data/auth-config.json";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Particle System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        ctx!.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      // Fewer particles on mobile for performance
      const count = window.innerWidth < 768 ? 50 : 100;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    init();
    animate();

    // GSAP Entry Animations
    const tl = gsap.timeline();
    tl.fromTo(welcomeRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
    ).fromTo(formRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
      "-=0.8"
    );

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => router.push("/"),
      });
    } else {
      setError(result.error || "Invalid login");
      setIsLoading(false);
      // Shake effect
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0] as any,
        duration: 0.4,
        ease: "power1.inOut"
      });
    }
  };

  return (
    <main 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col items-center justify-center px-5 md:p-6 bg-[#030303] overflow-hidden"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Dynamic Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030303]/60 to-[#030303] z-[1]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* iOS-style app icon */}
        <div className="mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[18px] md:rounded-[22px] bg-gold/10 border border-gold/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-breathe">
            <span className="text-gold text-2xl md:text-3xl font-serif">ا</span>
          </div>
        </div>

        <div ref={welcomeRef} className="text-center mb-8 md:mb-12">
          <h1 className="text-gold font-serif text-2xl md:text-3xl uppercase tracking-[0.15em] md:tracking-[0.2em] mb-3 md:mb-4 glow drop-shadow-2xl">
            Assalamu Alaikum
          </h1>
          <div className="w-10 md:w-12 h-[1px] bg-gold/40 mx-auto mb-4 md:mb-6" />
          <p className="text-foreground/80 font-light leading-relaxed text-xs md:text-sm max-w-xs md:max-w-sm mx-auto uppercase tracking-wider md:tracking-widest italic px-4">
            {authConfig.welcome_message.replace("Assalamu Alaikum — ", "")}
          </p>
        </div>

        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full bg-black/40 backdrop-blur-2xl border border-gold/20 p-6 md:p-10 rounded-2xl md:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gold/60 ml-1">Khandaan Identity</label>
              <input 
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Username"
                className="
                  w-full bg-white/5 border border-gold/10 
                  rounded-xl md:rounded-lg 
                  px-4 py-3.5 md:py-3 
                  text-sm 
                  focus:outline-none focus:border-gold/50 focus:bg-white/10 
                  transition-all 
                  placeholder:text-foreground/20
                "
              />
            </div>
            
            <div className="space-y-1.5 md:space-y-2 relative">
              <label className="text-[10px] uppercase tracking-widest text-gold/60 ml-1">Access Key</label>
              <div className="relative">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  className="
                    w-full bg-white/5 border border-gold/10 
                    rounded-xl md:rounded-lg 
                    px-4 py-3.5 md:py-3 
                    text-sm 
                    focus:outline-none focus:border-gold/50 focus:bg-white/10 
                    transition-all 
                    placeholder:text-foreground/20 pr-12
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold transition-colors p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center uppercase tracking-widest animate-pulse">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-4 mt-2 md:mt-4 
                bg-gold text-black 
                font-serif uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs 
                rounded-full md:rounded-lg 
                hover:bg-gold/90 
                transition-all 
                shadow-[0_0_20px_rgba(212,175,55,0.3)] 
                hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] 
                disabled:opacity-50 disabled:cursor-wait
                active:scale-95
              "
            >
              {isLoading ? "Validating Legacy..." : "Enter the Archive"}
            </button>
          </div>
        </form>

        <p className="mt-6 md:mt-8 text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-foreground/30 font-light">
          © 2026 Anwar Khandaan Heritage Society
        </p>
      </div>
    </main>
  );
}
