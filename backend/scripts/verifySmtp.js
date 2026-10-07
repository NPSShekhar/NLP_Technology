const environment = require("../config/env");
const transporter = require("../config/mailer");
const smtpError = require("../utils/smtpError");
(async () => {
  console.log("Environment file:", environment.envPath);
  console.log("SMTP configuration sources:", environment.sources);
  console.log("Process environment overrides differing from .env (keys only):", environment.conflicts);
  try {
    transporter.validateConfiguration();
    await transporter.verify();
    console.log("SMTP connection, TLS and authentication verified. No email sent. Sender authorization is not verified.");
  } catch (error) {
    console.error("SMTP verification failed:", JSON.stringify(smtpError(error), null, 2));
    process.exitCode = 1;
  } finally { transporter.close(); }
})();
