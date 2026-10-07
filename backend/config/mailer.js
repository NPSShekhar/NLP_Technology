require("./env");
const nodemailer = require("nodemailer");

function validateConfiguration(env = process.env) {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_REQUIRE_TLS", "SMTP_USER", "SMTP_APP_PASSWORD", "ADMIN_EMAIL", "MAIL_FROM", "MAIL_SUBJECT"];
  const missing = required.filter(key => key === "SMTP_APP_PASSWORD" ? typeof env[key] !== "string" || env[key].length === 0 : !env[key]?.trim());
  const invalid = [...missing];
  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) invalid.push("SMTP_PORT");
  for (const key of ["SMTP_SECURE", "SMTP_REQUIRE_TLS"]) {
    if (!["true", "false"].includes(env[key])) invalid.push(key);
  }
  if (port === 587 && (env.SMTP_SECURE !== "false" || env.SMTP_REQUIRE_TLS !== "true")) {
    invalid.push("SMTP_SECURE/SMTP_REQUIRE_TLS (port 587 requires STARTTLS)");
  }
  for (const key of ["MAIL_FROM", "ADMIN_EMAIL"]) {
    const value = env[key] || "";
    const address = key === "MAIL_FROM" ? (value.match(/<([^<>]+)>/)?.[1] || value).trim() : value.trim();
    if (/[\r\n]/.test(value) || !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(address)) invalid.push(key);
  }
  if (/[\r\n]/.test(env.MAIL_SUBJECT || "")) invalid.push("MAIL_SUBJECT");
  if (invalid.length) {
    const error = new Error("Missing or invalid mail configuration: " + [...new Set(invalid)].join(", ") + ". MAIL_FROM must be a client-confirmed authorized sender.");
    error.code = "SMTP_CONFIG_INVALID";
    throw error;
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  requireTLS: process.env.SMTP_REQUIRE_TLS === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
  tls: { rejectUnauthorized: true },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

transporter.validateConfiguration = validateConfiguration;
module.exports = transporter;
