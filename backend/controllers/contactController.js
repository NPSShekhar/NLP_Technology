const smtpError = require("../utils/smtpError");
const pool = require("../config/db");
const transporter = require("../config/mailer");

const {
  validateContactPayload,
} = require("../utils/contactValidation");

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

/**
 * POST /api/contact-enquiries
 */
const createContactEnquiry = async (req, res) => {
  let client;

  try {
    // ----------------------------------------
    // 1. Validate request
    // ----------------------------------------
    const validation = validateContactPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Please correct the form errors.",
        errors: validation.errors,
      });
    }

    const {
      name,
      email,
      phone,
      address,
      message,
    } = validation.data;

    // ----------------------------------------
    // 2. Get database connection
    // ----------------------------------------
    transporter.validateConfiguration();
    client = await pool.connect();

    await client.query("BEGIN");

    // ----------------------------------------
    // 3. Save enquiry to database
    // ----------------------------------------
    const insertResult = await client.query(
      `
        INSERT INTO contact_enquiries (
          name,
          email,
          phone,
          address,
          message, file_name, file_type, file_data
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
          id,
          name,
          email,
          phone,
          address,
          message,
          email_sent,
          email_sent_at,
          created_at
      `,
      [
        name,
        email,
        phone,
        address,
        message,
        req.file?.originalname || null,
        req.file?.mimetype || null,
        req.file?.buffer || null,
      ]
    );

    const enquiry = insertResult.rows[0];

    // ----------------------------------------
    // 4. Check required mail configuration
    // ----------------------------------------
    if (!process.env.MAIL_FROM) {
      throw new Error("MAIL_FROM is not configured.");
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured.");
    }

    // ----------------------------------------
    // 5. Prepare email
    // ----------------------------------------
    const mailFrom = {
      name: "NLP Technology Sdn. Bhd.",
      address: (process.env.MAIL_FROM.match(/<([^<>]+)>/)?.[1] || process.env.MAIL_FROM).trim(),
    };

    const mailOptions = {
      from: mailFrom,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,

      subject: process.env.MAIL_SUBJECT,

      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Message:
${message}
      `.trim(),

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            color: #222;
            line-height: 1.6;
          "
        >
          <p>
            <strong>Name:</strong>
            ${escapeHtml(name)}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email)}
          </p>

          <p>
            <strong>Phone:</strong>
            ${escapeHtml(phone)}
          </p>

          <p>
            <strong>Address:</strong>
            ${escapeHtml(address)}
          </p>

          <p style="margin-bottom: 4px;">
            <strong>Message:</strong>
          </p>

          <p style="margin: 0; white-space: pre-line;">${escapeHtml(message)}</p>
        </div>
      `,
    };

    // ----------------------------------------
    // 6. Add uploaded file if available
    // ----------------------------------------
    if (req.file) {
      if (req.file.buffer) {
        // Memory storage
        mailOptions.attachments = [
          {
            filename: req.file.originalname,
            content: req.file.buffer,
          },
        ];
      } else if (req.file.path) {
        // Disk storage
        mailOptions.attachments = [
          {
            filename: req.file.originalname,
            path: req.file.path,
          },
        ];
      }
    }

    // ----------------------------------------
    // 7. Send email
    // ----------------------------------------
    console.log("Sending contact enquiry email...");

    await transporter.sendMail(mailOptions);

    console.log("Contact enquiry email sent successfully.");

    // ----------------------------------------
    // 8. Mark email as sent
    // ----------------------------------------
    const updateResult = await client.query(
      `
        UPDATE contact_enquiries
        SET
          email_sent = TRUE,
          email_sent_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
          id,
          name,
          email,
          phone,
          address,
          message,
          email_sent,
          email_sent_at,
          created_at
      `,
      [enquiry.id]
    );

    // ----------------------------------------
    // 9. Commit transaction
    // ----------------------------------------
    await client.query("COMMIT");

    // Save the enquiry before sending the customer's acknowledgement.
    // A confirmation failure must not cause a duplicate submission.
    client.release();
    client = null;

    let confirmationEmailSent = false;
    try {
      await transporter.sendMail({
        from: mailFrom,
        to: { address: email, name },
        replyTo: process.env.ADMIN_EMAIL,
        subject: "We received your enquiry - NLP Technology Sdn. Bhd.",
        text: [
          `Hi ${name},`,
          "Thank you for contacting NLP Technology Sdn. Bhd. We have received your enquiry.",
          "Our team will review your requirements and get back to you. You can reply to this email if you need to add any details.",
          "Regards,\nNLP Technology Sdn. Bhd.",
        ].join("\n\n"),
        html: `
          <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6;">
            <h2 style="color: #00A7E8; margin-top: 0;">We received your enquiry</h2>
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thank you for contacting NLP Technology Sdn. Bhd. We have received your enquiry.</p>
            <p>Our team will review your requirements and get back to you. You can reply to this email if you need to add any details.</p>
            <p>Regards,<br>NLP Technology Sdn. Bhd.</p>
          </div>
        `,
      });
      confirmationEmailSent = true;
    } catch (confirmationError) {
      console.error("Enquiry confirmation email failed:", {
        enquiryId: enquiry.id,
        ...smtpError(confirmationError),
      });
    }

    return res.status(201).json({
      success: true,
      message: confirmationEmailSent
        ? "Enquiry submitted successfully. A confirmation email has been sent to your email address. Please check your inbox or spam folder."
        : "Enquiry submitted successfully, but we could not send the confirmation email. Our team will still contact you; you do not need to submit again.",
      confirmationEmailSent,
      enquiry: updateResult.rows[0],
    });
  } catch (error) {
    // ----------------------------------------
    // Rollback transaction
    // ----------------------------------------
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError.message
        );
      }
    }

    // ----------------------------------------
    // Log complete error
    // ----------------------------------------
    console.error(
      "Contact enquiry submission error:"
    );

    console.error("SMTP diagnostic:", smtpError(error));

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your enquiry. Please try again.",
    });
  } finally {
    // ----------------------------------------
    // Release database connection
    // ----------------------------------------
    if (client) {
      client.release();
    }
  }
};

/**
 * GET /api/contact-enquiries
 */
const getAllContactEnquiries = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        message,
        email_sent,
        email_sent_at,
        created_at,
        file_name, file_type
      FROM contact_enquiries
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      enquiries: result.rows,
    });
  } catch (error) {
    console.error(
      "Get contact enquiries error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve enquiries.",
    });
  }
};

const deleteContactEnquiry = async (req, res) => {
  const id = Number(req.params.id);
  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ success: false, message: "Invalid enquiry ID." });
  }
  try {
    const result = await pool.query("DELETE FROM contact_enquiries WHERE id = $1 RETURNING id", [id]);
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }
    return res.json({ success: true, message: "Enquiry deleted." });
  } catch (error) {
    console.error("Delete enquiry failed:", error.code);
    return res.status(500).json({ success: false, message: "Unable to delete enquiry. Please try again." });
  }
};

const getContactFile = async (req, res) => {
  const id = Number(req.params.id);
  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ message: "Invalid enquiry ID." });
  }
  try {
    const result = await pool.query("SELECT file_name, file_type, file_data FROM contact_enquiries WHERE id = $1", [id]);
    const file = result.rows[0];
    if (!file?.file_data) return res.status(404).json({ message: "No uploaded file is available for this enquiry." });
    const safeTypes = ["application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp", "text/plain"];
    res.attachment(file.file_name || "attachment");
    res.setHeader("Content-Type", safeTypes.includes(file.file_type) ? file.file_type : "application/octet-stream");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "sandbox");
    return res.send(file.file_data);
  } catch (error) {
    console.error("Get enquiry file failed:", error.code);
    return res.status(500).json({ message: "Unable to retrieve uploaded file." });
  }
};

module.exports = {
  getContactFile,
  createContactEnquiry,
  getAllContactEnquiries,
  deleteContactEnquiry,
};
