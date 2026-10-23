// Use the current domain in production and the Vite /api proxy in development.
const configuredBase = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
const isLoopback = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?=[:/]|$)/i.test(configuredBase);
// Ignore stale local API overrides in deployed builds.
export const API_URL = import.meta.env.PROD && isLoopback ? "" : configuredBase;
