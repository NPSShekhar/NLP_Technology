const { createHash, timingSafeEqual } = require("node:crypto");

const matches = (value, expected) => timingSafeEqual(
  createHash("sha256").update(value).digest(),
  createHash("sha256").update(expected).digest()
);

// Prefer server-only credentials; support the existing deployment during migration.
module.exports = function requireAdmin(req, res, next) {
  const username = process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
  res.set("Cache-Control", "no-store");
  if (!username || !password) {
    return res.status(503).json({ success: false, message: "Admin login is not configured." });
  }
  const authorization = req.get("Authorization") || "";
  const decoded = authorization.startsWith("Basic ")
    ? Buffer.from(authorization.slice(6), "base64").toString("utf8") : "";
  const separator = decoded.indexOf(":");
  if (separator < 0 || !matches(decoded.slice(0, separator), username) || !matches(decoded.slice(separator + 1), password)) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }
  next();
};
