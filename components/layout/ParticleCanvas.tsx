"use client";

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaDir: number;
  twinkleSpeed: number;
  color: string;
}

interface CursorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;       // 0 → 1 (0 = dead)
  maxLife: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "star";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = "212,175,55";
const WHITE = "255,255,255";
const PALE_GOLD = "255,215,100";
const AMBER = "255,190,50";
const CURSOR_COLORS = [GOLD, PALE_GOLD, WHITE, AMBER, GOLD, GOLD];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function createAmbient(w: number, h: number): AmbientParticle {
  const colors = [GOLD, WHITE, PALE_GOLD, GOLD];
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.2,
    vy: -(Math.random() * 0.12 + 0.04),
    radius: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.35 + 0.08,
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: Math.random() * 0.006 + 0.002,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function spawnCursorParticle(x: number, y: number): CursorParticle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 2.5 + 0.5;
  const life = Math.random() * 40 + 30; // frames
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.8, // slight upward bias
    radius: Math.random() * 3 + 1,
    life,
    maxLife: life,
    color: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    shape: Math.random() > 0.4 ? "circle" : "star",
  };
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rotation: number) {
  const spikes = 4;
  const inner = r * 0.45;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i * Math.PI) / spikes;
    const rad = i % 2 === 0 ? r : inner;
    if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, moving: false });
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let ambient: AmbientParticle[] = [];
    let cursors: CursorParticle[] = [];
    let frameCount = 0;

    // ── Resize ──────────────────────────────────────────────────────────────
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 7000);
      ambient = Array.from({ length: count }, () =>
        createAmbient(canvas.width, canvas.height)
      );
    }

    // ── Mouse tracking ───────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY, moving: true };
      if (moveTimer.current) clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => {
        mouse.current.moving = false;
      }, 100);
    }

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw() {
      if (!canvas || !ctx) return;
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn cursor particles every few frames when moving
      if (mouse.current.moving && frameCount % 2 === 0) {
        const count = Math.floor(Math.random() * 3) + 2; // 2–4 per burst
        for (let i = 0; i < count; i++) {
          cursors.push(spawnCursorParticle(mouse.current.x, mouse.current.y));
        }
      }

      // ── Render ambient background particles ─────────────────────────────
      for (const p of ambient) {
        p.alpha += p.alphaDir * p.twinkleSpeed;
        if (p.alpha > 0.5) { p.alpha = 0.5; p.alphaDir = -1; }
        if (p.alpha < 0.05) { p.alpha = 0.05; p.alphaDir = 1; }

        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Glow halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
        grd.addColorStop(0, `rgba(${p.color},${p.alpha})`);
        grd.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${Math.min(p.alpha * 3, 0.9)})`;
        ctx.fill();
      }

      // ── Render cursor trail particles ────────────────────────────────────
      cursors = cursors.filter((p) => {
        p.life -= 1;
        if (p.life <= 0) return false;

        const progress = p.life / p.maxLife; // 1 → 0 as it dies
        const alpha = progress * 0.9;
        const radius = p.radius * (0.3 + progress * 0.7);

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gentle gravity pull
        p.vx *= 0.97; // air resistance
        p.rotation += p.rotationSpeed;

        // Outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6);
        grd.addColorStop(0, `rgba(${p.color},${alpha * 0.8})`);
        grd.addColorStop(0.4, `rgba(${p.color},${alpha * 0.3})`);
        grd.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core shape
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(${p.color},1)`;
        ctx.shadowBlur = radius * 10;
        ctx.shadowColor = `rgba(${p.color},0.9)`;

        if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, radius, p.rotation);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        return true;
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (moveTimer.current) clearTimeout(moveTimer.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
