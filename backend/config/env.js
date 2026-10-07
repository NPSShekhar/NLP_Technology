const path = require("node:path");
const fs = require("node:fs");
const dotenv = require("dotenv");
const envPath = path.join(__dirname, "..", ".env");
const inherited = new Set(Object.keys(process.env));
const parsed = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};
const keys = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_REQUIRE_TLS", "SMTP_USER", "SMTP_APP_PASSWORD", "ADMIN_EMAIL", "MAIL_FROM", "MAIL_SUBJECT"];
const sources = Object.fromEntries(keys.map(key => [key, inherited.has(key) ? "process environment" : Object.hasOwn(parsed, key) ? "backend/.env" : "missing"]));
const conflicts = keys.filter(key => inherited.has(key) && Object.hasOwn(parsed, key) && process.env[key] !== parsed[key]);
// Deployment environment takes precedence; never overwrite it implicitly.
dotenv.config({ path: envPath, override: false, quiet: true });
module.exports = { envPath, sources, conflicts };
