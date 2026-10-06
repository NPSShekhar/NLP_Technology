export const HOME_ROUTE = "/";
export const LAUNCH_DURATION = 65;

export function remainingLaunchSeconds(deadline, now = Date.now()) {
  return Math.min(LAUNCH_DURATION, Math.max(1, Math.ceil((deadline - now) / 1000)));
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
