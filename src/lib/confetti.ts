// Lightweight, dependency-free confetti burst (no sound).
// Spawns a temporary full-screen canvas, animates particles, then cleans itself up.

const COLORS = ["#5B21FF", "#7C54FF", "#4A9EFF", "#00C9A7", "#FFB347", "#FF6B6B"];

export function burstConfetti(opts?: { count?: number }) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const count = opts?.count ?? 150;
  const W = window.innerWidth;
  const H = window.innerHeight;

  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // two "cannons" near the top for a fuller spread
  const origins = [
    { x: W * 0.5, y: H * 0.3 },
  ];

  type P = {
    x: number; y: number; vx: number; vy: number; g: number;
    size: number; rot: number; vr: number; color: string; life: number; max: number;
  };

  const parts: P[] = Array.from({ length: count }, () => {
    const o = origins[(Math.random() * origins.length) | 0];
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    return {
      x: o.x,
      y: o.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (3 + Math.random() * 5),
      g: 0.16 + Math.random() * 0.12,
      size: 6 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      life: 0,
      max: 90 + Math.random() * 50,
    };
  });

  let raf = 0;
  function frame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of parts) {
      p.life++;
      if (p.life > p.max) continue;
      alive = true;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      const a = 1 - p.life / p.max;
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (alive) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  }
  frame();
}
