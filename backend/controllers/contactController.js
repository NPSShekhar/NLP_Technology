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
          message
        )
        VALUES ($1, $2, $3, $4, $5)
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
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,

      subject: `New enquiry from ${name}`,

      text: `
New enquiry received.

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
          <h2 style="color: #00A7E8;">
            New Enquiry
          </h2>

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

          <p>
            <strong>Message:</strong>
          </p>

          <p style="white-space: pre-line;">
            ${escapeHtml(message)}
          </p>
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
    console.log("MAIL_FROM:", process.env.MAIL_FROM);
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("Reply-To:", email);
    console.log("Attachment:", req.file ? req.file.originalname : "None");

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

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
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

    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);

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
        created_at
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

module.exports = {
  createContactEnquiry,
  getAllContactEnquiries,
};