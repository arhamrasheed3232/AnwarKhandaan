"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBlockedAutoplay, setHasBlockedAutoplay] = useState(false);

  // Use the working live URL
  const AUDIO_SRC = "/audio/theme.mp3";

  const startPlayback = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setHasBlockedAutoplay(false);
        // Fade in
        fadeAudio(audioRef.current!, 0.3, 3000);
      })
      .catch((err) => {
        console.log("Autoplay blocked, waiting for interaction:", err);
        setHasBlockedAutoplay(true);
      });
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_SRC);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    // Try to start immediately
    startPlayback();

    // Listen for the first interaction anywhere on the document to bypass autoplay blocks
    const handleFirstInteraction = () => {
      if (!isPlaying) {
        startPlayback();
      }
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [startPlayback, isPlaying]);

  const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const startVolume = audio.volume;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newVol = startVolume + (targetVolume - startVolume) * progress;
      audio.volume = Math.max(0, Math.min(1, newVol));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (targetVolume === 0) {
        audio.pause();
      }
    };
    requestAnimationFrame(step);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      setIsPlaying(false);
      fadeAudio(audio, 0, 1500); 
    } else {
      setIsPlaying(true);
      audio.play().catch(console.error);
      fadeAudio(audio, 0.3, 1500); 
    }
    setHasBlockedAutoplay(false);
  };

  return (
    <>
      {/* Desktop: bottom-left */}
      <div className="fixed bottom-8 left-8 z-[100] hidden md:flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className={`relative group p-4 rounded-full border transition-all duration-500 backdrop-blur-xl ${
            isPlaying 
              ? "border-gold bg-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.3)]" 
              : "border-gold/30 bg-black/40 hover:border-gold"
          }`}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </motion.div>
            ) : (
              <motion.div
                key="muted"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold/50"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              </motion.div>
            )}
          </AnimatePresence>

          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-20" />
          )}
        </motion.button>

        <AnimatePresence>
          {hasBlockedAutoplay && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="px-4 py-2 bg-gold/10 border border-gold/20 backdrop-blur-md rounded-lg"
            >
              <p className="text-[10px] uppercase tracking-widest text-gold font-serif">
                Click anywhere to start Heritage Soundscape
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Floating pill above tab bar */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={togglePlay}
        className={`
          fixed z-[100] md:hidden
          right-4
          flex items-center gap-2
          px-4 py-2.5
          rounded-full
          border transition-all duration-500
          backdrop-blur-xl
          ${isPlaying 
            ? "border-gold/40 bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
            : "border-gold/20 bg-black/60"
          }
        `}
        style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}
      >
        {isPlaying ? (
          <>
            {/* Equalizer bars */}
            <div className="flex items-end gap-[2px] h-4">
              {[0, 0.15, 0.3, 0.15].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-gold rounded-full"
                  animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay }}
                />
              ))}
            </div>
            <span className="text-[9px] uppercase tracking-widest text-gold font-medium">Playing</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/50">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
            <span className="text-[9px] uppercase tracking-widest text-foreground/40 font-medium">Sound</span>
          </>
        )}
      </motion.button>
    </>
  );
}
