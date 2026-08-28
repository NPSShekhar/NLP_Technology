const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },

  // Reuse the SMTP connection instead of creating
  // a new connection for every enquiry.
  pool: true,
  maxConnections: 3,
  maxMessages: 100,

  // Prevent the request from hanging for a long time
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

module.exports = transporter;