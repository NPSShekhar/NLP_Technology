// Google enforces single-use tokens across workers; never cache successful checks.
module.exports = function verifyRecaptcha(expectedAction) {
  return async (req, res, next) => {
    res.set("Cache-Control", "no-store");
    const token = req.get("X-Recaptcha-Token");
    const deny = () => res.status(403).json({ success: false, message: "Security verification failed. Please try again." });
    const unavailable = () => res.status(503).json({ success: false, message: "Security verification is unavailable. Please try again shortly." });
    if (typeof token !== "string" || !token.trim() || token.length > 8192) return deny();
    const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
    const hosts = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "").split(",").map(host => host.trim().toLowerCase()).filter(Boolean);
    const rawScore = process.env.RECAPTCHA_MIN_SCORE ?? "0.5";
    const minScore = Number(rawScore);
    if (!secret || !hosts.length || !String(rawScore).trim() || !Number.isFinite(minScore) || minScore < 0 || minScore > 1) return unavailable();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        signal: controller.signal,
        redirect: "error",
      });
      if (!response.ok) return unavailable();
      const result = await response.json();
      const timestamp = typeof result?.challenge_ts === "string" ? Date.parse(result.challenge_ts) : NaN;
      const age = Date.now() - timestamp;
      if (result?.success !== true || typeof result.score !== "number" || !Number.isFinite(result.score) ||
          result.score < minScore || result.score > 1 || result.action !== expectedAction ||
          typeof result.hostname !== "string" || !hosts.includes(result.hostname.toLowerCase()) ||
          !Number.isFinite(age) || age < 0 || age > 120000 ||
          (result["error-codes"] != null && (!Array.isArray(result["error-codes"]) || result["error-codes"].length > 0))) return deny();
    } catch {
      // Do not log upstream errors: they may contain tokens or the secret.
      return unavailable();
    } finally {
      clearTimeout(timeout);
    }
    return next();
  };
};
