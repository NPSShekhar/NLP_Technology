export const HOME_ROUTE = "/";
export const LAUNCH_DURATION_SECONDS = 65; // 2 minutes

const STORAGE_KEY = "nlp_launch_target_time";

export function getLaunchTargetTime() {
  if (typeof window === "undefined") {
    return Date.now() + LAUNCH_DURATION_SECONDS * 1000;
  }
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    const newTarget = Date.now() + LAUNCH_DURATION_SECONDS * 1000;
    window.sessionStorage.setItem(STORAGE_KEY, String(newTarget));
    return newTarget;
  } catch {
    return Date.now() + LAUNCH_DURATION_SECONDS * 1000;
  }
}

export function resetLaunchTargetTime() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function currentLaunchState() {
  if (typeof window === "undefined") {
    return { phase: "countdown", seconds: LAUNCH_DURATION_SECONDS };
  }
  const target = getLaunchTargetTime();
  const diff = target - Date.now();
  // STOP at 01 sec and freeze: never count down to 0, never reset to 120 while on page
  if (diff <= 1000) {
    return { phase: "ready", seconds: 1 };
  }
  return { phase: "countdown", seconds: Math.ceil(diff / 1000) };
}

// Retained for existing test suite compatibility
export function launchScheduleState(launchAt, countdownMinutes = 10, now = Date.now()) {
  const value = String(launchAt || "").trim();
  const deadline = /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? Date.parse(value) : NaN;
  if (!Number.isFinite(deadline)) return { phase: "soon", seconds: null };
  const minutes = Number(countdownMinutes);
  const windowMs = (Number.isFinite(minutes) && minutes > 0 ? minutes : 10) * 60000;
  const remaining = deadline - now;
  if (remaining > windowMs) return { phase: "soon", seconds: null };
  if (remaining <= 0) return { phase: "ready", seconds: 1 };
  return { phase: "countdown", seconds: Math.ceil(remaining / 1000) };
}

const CONSUMED_STORAGE_KEY = "nlp_consumed_launch_celebrations";

function getConsumedStorage() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(CONSUMED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function persistConsumedToken(token) {
  if (typeof window === "undefined" || !token) return;
  try {
    const set = getConsumedStorage();
    set.add(String(token));
    window.sessionStorage.setItem(CONSUMED_STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Ignore storage errors
  }
}

let pendingCelebration = null;
const consumedCelebrations = new Set();

export function prepareLaunchCelebration() {
  const token = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
  pendingCelebration = token;
  return token;
}

export function consumeLaunchCelebration(token) {
  if (!token) return false;
  const strToken = String(token);
  if (!pendingCelebration || strToken !== pendingCelebration) return false;
  if (consumedCelebrations.has(strToken)) return false;
  const stored = getConsumedStorage();
  if (stored.has(strToken)) {
    consumedCelebrations.add(strToken);
    return false;
  }
  consumedCelebrations.add(strToken);
  persistConsumedToken(strToken);
  pendingCelebration = null;
  return true;
}

