export const HOME_ROUTE = "/";

// A timezone offset makes the launch instant identical for all visitors.
export function launchScheduleState(launchAt, countdownMinutes = 10, now = Date.now()) {
  const value = String(launchAt || "").trim();
  const deadline = /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? Date.parse(value) : NaN;
  if (!Number.isFinite(deadline)) return { phase: "soon", seconds: null };
  const minutes = Number(countdownMinutes);
  const windowMs = (Number.isFinite(minutes) && minutes > 0 ? minutes : 10) * 60000;
  const remaining = deadline - now;
  if (remaining > windowMs) return { phase: "soon", seconds: null };
  // Hold the final display at 01; unlock at the configured launch time.
  if (remaining <= 0) return { phase: "ready", seconds: 1 };
  return { phase: "countdown", seconds: Math.ceil(remaining / 1000) };
}

export function currentLaunchState() {
  return launchScheduleState(import.meta.env.VITE_LAUNCH_AT, import.meta.env.VITE_LAUNCH_COUNTDOWN_MINUTES);
}

// Memory-only intent cannot survive refresh or be replayed by browser history.
let pendingCelebration = null;

export function prepareLaunchCelebration() {
  pendingCelebration = crypto.randomUUID();
  return pendingCelebration;
}

export function consumeLaunchCelebration(token) {
  if (!token || token !== pendingCelebration) return false;
  pendingCelebration = null;
  return true;
}
