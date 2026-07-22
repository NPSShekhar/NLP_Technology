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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

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

    await transporter.sendMail({
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
        <div style="font-family: Arial, sans-serif; color: #222;">
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
    });

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

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      enquiry: updateResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Contact enquiry submission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your enquiry. Please try again.",
    });
  } finally {
    client.release();
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