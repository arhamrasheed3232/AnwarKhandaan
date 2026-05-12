"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Home", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { href: "/family-tree", label: "Tree", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/>
        <line x1="12" y1="8" x2="12" y2="14"/>
        <line x1="12" y1="14" x2="6" y2="18"/>
        <line x1="12" y1="14" x2="18" y2="18"/>
        <circle cx="6" cy="19" r="2"/>
        <circle cx="18" cy="19" r="2"/>
      </svg>
    )},
    { href: "/timeline", label: "Timeline", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    )},
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ─── Desktop Top Bar ─── */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 
        hidden md:flex items-center justify-between 
        px-10 py-6
        transition-all duration-700
        ${scrolled 
          ? "bg-[#020202]/80 backdrop-blur-3xl border-b border-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-4" 
          : "bg-transparent border-b border-transparent py-6"
        }
      `}>
        <Link 
          href="/" 
          className="text-2xl font-serif text-gold gold-glow uppercase tracking-[0.2em] hover:text-white transition-colors duration-500 whitespace-nowrap"
        >
          Anwar Khandaan
        </Link>
        <ul className="flex items-center gap-12 text-[11px] font-medium tracking-[0.3em] uppercase">
          {links.map(link => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={`
                  relative py-2 transition-all duration-500
                  ${isActive(link.href) 
                    ? "text-gold gold-glow" 
                    : "text-foreground/70 hover:text-gold hover:gold-glow"
                  }
                `}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span 
                    layoutId="activeDesktop"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ─── Mobile Top Bar (minimal, just logo) ─── */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 
        flex md:hidden items-center justify-between
        px-5 transition-all duration-500
        ${scrolled 
          ? "bg-[#020202]/90 backdrop-blur-3xl border-b border-gold/10 py-3" 
          : "bg-transparent py-4"
        }
      `}
        style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}
      >
        <Link 
          href="/" 
          className="text-lg font-serif text-gold gold-glow uppercase tracking-[0.15em]"
        >
          Anwar Khandaan
        </Link>

        {/* Hamburger for additional options */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gold/60 hover:text-gold transition-colors"
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7"/>
                <line x1="4" y1="12" x2="16" y2="12"/>
                <line x1="4" y1="17" x2="12" y2="17"/>
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* ─── Mobile Full-screen Menu Overlay ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#020202]/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-2 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-4 py-4 px-8 rounded-2xl transition-all duration-300
                    ${isActive(link.href) 
                      ? "text-gold bg-gold/10 border border-gold/20" 
                      : "text-foreground/70 hover:text-gold"
                    }
                  `}
                >
                  <span className={isActive(link.href) ? "text-gold" : "text-foreground/40"}>
                    {link.icon}
                  </span>
                  <span className="text-xl font-serif uppercase tracking-[0.2em]">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-[10px] uppercase tracking-[0.3em] text-foreground/30"
            >
              Tap anywhere to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Bottom Tab Bar (iOS-style) ─── */}
      <div 
        className="
          fixed bottom-0 left-0 right-0 z-50 
          flex md:hidden items-center justify-around
          bg-[#0a0a0a]/90 backdrop-blur-3xl
          border-t border-gold/10
          shadow-[0_-4px_30px_rgba(0,0,0,0.6)]
        "
        style={{ 
          paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
          paddingTop: "8px"
        }}
      >
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-300
              ${isActive(link.href) 
                ? "text-gold" 
                : "text-foreground/40 active:text-gold/70"
              }
            `}
          >
            <span className={`transition-transform duration-300 ${isActive(link.href) ? "scale-110" : ""}`}>
              {link.icon}
            </span>
            <span className={`text-[9px] uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
              isActive(link.href) ? "text-gold" : ""
            }`}>
              {link.label}
            </span>
            {isActive(link.href) && (
              <motion.span
                layoutId="activeMobileTab"
                className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
