function hexToRgb(str) {
  const val = String(str).replace(/[^0-9a-f]/gi, "");
  const hex =
    val.length < 6
      ? (val[0] || "0") + (val[0] || "0") +
        (val[1] || "0") + (val[1] || "0") +
        (val[2] || "0") + (val[2] || "0")
      : val;
  return {
    r: parseInt(hex.substring(0, 2), 16) || 0,
    g: parseInt(hex.substring(2, 4), 16) || 0,
    b: parseInt(hex.substring(4, 6), 16) || 0,
  };
}

export function create(canvas, { resize = true } = {}) {
  const ctx = canvas?.getContext?.("2d");
  let particles = [];
  let animId = null;

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : null;
    const w = (rect && rect.width) || (typeof window !== "undefined" ? window.innerWidth : 800);
    const h = (rect && rect.height) || (typeof window !== "undefined" ? window.innerHeight : 600);
    const targetW = Math.max(1, Math.floor(w * dpr));
    const targetH = Math.max(1, Math.floor(h * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
  }

  if (resize && typeof window !== "undefined") {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  function loop() {
    if (particles.length === 0) {
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      animId = null;
      return;
    }

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.tick++;

        p.x += (Math.cos(p.angle2D) * p.velocity + p.drift) * dpr;
        p.y += (Math.sin(p.angle2D) * p.velocity + p.gravity) * dpr;
        p.velocity *= p.decay;

        p.wobble += p.wobbleSpeed;
        p.tiltAngle += 0.1;

        const wobbleX = p.x + 10 * p.scalar * dpr * Math.cos(p.wobble);
        const wobbleY = p.y + 10 * p.scalar * dpr * Math.sin(p.wobble);
        const tiltCos = Math.cos(p.tiltAngle);

        const progress = p.tick / p.totalTicks;
        const alpha = Math.max(0, 1 - progress);

        // Small tumbling paper rectangles, with a visible face instead of thin shards.
        const size = 6 * p.scalar * dpr;
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.save();
        ctx.translate(wobbleX, wobbleY);
        ctx.rotate(p.tiltAngle);
        ctx.scale(1, Math.max(0.25, Math.abs(tiltCos)));
        ctx.fillRect(-size / 2, -size / 3, size, size * 0.7);
        ctx.restore();

        if (p.tick >= p.totalTicks || p.y > canvas.height + 80) {
          particles.splice(i, 1);
        }
      }
    }

    if (particles.length > 0 && typeof requestAnimationFrame === "function") {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
    }
  }

  function burst(options = {}) {
    if (!ctx || !canvas) return;
    if (resize) resizeCanvas();

    const count = options.particleCount ?? 20;
    const angle = options.angle ?? 90;
    const spread = options.spread ?? 45;
    const startVelocity = options.startVelocity ?? 45;
    const decay = options.decay ?? 0.9;
    const gravity = (options.gravity ?? 1) * 3;
    const drift = options.drift ?? 0;
    const ticks = options.ticks ?? 200;
    const scalar = options.scalar ?? 1;
    const origin = options.origin ?? { x: 0.5, y: 0.5 };
    const palette = options.colors || ["#e5a20b", "#202020", "#337ead", "#ddd2bb"];
    const colors = palette.map(hexToRgb);

    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);

    const originX = canvas.width * (origin.x ?? 0.5);
    const originY = canvas.height * (origin.y ?? 0.5);

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: originX,
        y: originY,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
        velocity: startVelocity * 0.5 + Math.random() * startVelocity,
        angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
        tiltAngle: (Math.random() * 0.5 + 0.25) * Math.PI,
        color,
        tick: 0,
        totalTicks: ticks,
        decay,
        drift,
        gravity,
        scalar,
        random: Math.random() + 2,
      });
    }

    if (!animId && typeof requestAnimationFrame === "function") {
      animId = requestAnimationFrame(loop);
    }
  }

  burst.reset = () => {
    particles = [];
    if (animId && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (resize && typeof window !== "undefined") {
      window.removeEventListener("resize", resizeCanvas);
    }
  };

  return burst;
}

const confetti = { create };
export default confetti;
