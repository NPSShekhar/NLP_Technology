import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import confetti from "../lib/confetti";
import { consumeLaunchCelebration, HOME_ROUTE } from "../lib/launch";

export default function LaunchCelebration() {
  const { pathname, state, key } = useLocation();

  useEffect(() => {
    if (pathname !== HOME_ROUTE || !state?.launchCelebration) return;

    let frame;
    let cleanup = () => {};
    // Two frames ensure the existing Home page has painted. StrictMode's
    // first cleanup cancels its frame before the intent can be consumed.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!consumeLaunchCelebration(state.launchCelebration)) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.dataset.launchCelebration = "true";
        Object.assign(canvas.style, {
          position: "fixed", inset: "0", width: "100%", height: "100%",
          pointerEvents: "none", zIndex: "2147483647",
        });
        document.body.appendChild(canvas);
        const burst = confetti.create(canvas, { resize: true });
        // Two fixed top-corner emitters fan inward, then the paper falls away.
        const startedAt = performance.now();
        const palette = ["#e5a20b", "#202020", "#337ead", "#ddd2bb"];
        const emitRain = () => {
          if (performance.now() - startedAt >= 4200) return;
          const options = {
            colors: palette,
            shapes: ["square"],
            particleCount: window.innerWidth < 640 ? 3 : 6,
            spread: 70,
            startVelocity: 16 * Math.min(1.5, window.innerWidth / 1280),
            decay: 0.975,
            gravity: 0.6 * window.innerHeight / 900,
            scalar: 1.2,
            ticks: 660,
            disableForReducedMotion: true,
          };
          for (const side of ["left", "right"]) {
            burst({
              ...options,
              angle: side === "left" ? 315 : 225,
              drift: side === "left" ? 0.15 : -0.15,
              origin: { x: side === "left" ? 0 : 1, y: 0 },
            });
          }
        };
        emitRain();
        const rain = setInterval(emitRain, 120);
        const stopRain = setTimeout(() => clearInterval(rain), 4200);
        const finish = setTimeout(() => cleanup(), 12600);
        cleanup = () => {
          clearInterval(rain);
          clearTimeout(stopRain);
          clearTimeout(finish);
          burst.reset();
          canvas.remove();
        };
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [pathname, state, key]);

  return null;
}
