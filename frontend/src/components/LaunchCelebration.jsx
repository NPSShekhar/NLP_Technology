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

    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!consumeLaunchCelebration(state.launchCelebration)) return;

        // Clean up history state immediately so page refresh will not re-trigger celebration
        if (typeof window !== "undefined" && window.history?.replaceState) {
          try {
            const currentHistoryState = window.history.state;
            if (currentHistoryState && typeof currentHistoryState === "object") {
              if (currentHistoryState.usr && typeof currentHistoryState.usr === "object") {
                const updatedUsr = { ...currentHistoryState.usr };
                delete updatedUsr.launchCelebration;
                window.history.replaceState({ ...currentHistoryState, usr: updatedUsr }, "");
              } else if (currentHistoryState.launchCelebration) {
                const updatedState = { ...currentHistoryState };
                delete updatedState.launchCelebration;
                window.history.replaceState(updatedState, "");
              }
            }
          } catch {
            // Ignore history state errors
          }
        }

        const canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.dataset.launchCelebration = "true";
        Object.assign(canvas.style, {
          position: "fixed",
          inset: "0",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: "2147483647",
        });
        document.body.appendChild(canvas);
        const burst = confetti.create(canvas, { resize: true });

        const startedAt = performance.now();
        const palette = ["#e5a20b", "#202020", "#337ead", "#ddd2bb", "#00B2F9"];
        const emitRain = () => {
          if (performance.now() - startedAt >= 4200) return;
          const options = {
            colors: palette,
            shapes: ["square"],
            particleCount: window.innerWidth < 640 ? 4 : 8,
            spread: 70,
            startVelocity: 16 * Math.min(1.5, window.innerWidth / 1280),
            decay: 0.975,
            gravity: (0.6 * window.innerHeight) / 900,
            scalar: 1.8,
            ticks: 660,
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
