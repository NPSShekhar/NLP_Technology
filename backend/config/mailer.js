const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },

  pool: true,
  maxConnections: 3,
  maxMessages: 100,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

module.exports = transporter;