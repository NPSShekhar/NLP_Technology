const pool = require("../config/db");

const ALLOWED_PLATFORMS = [
  "linkedin",
  "twitter",
  "youtube",
  "facebook",
  "instagram",
];

const formatSocialLink = (link) => ({
  id: link.id,
  platform: link.platform,
  url: link.url,
  sort_order: link.sort_order,
  created_at: link.created_at,
  updated_at: link.updated_at,
});

const validateId = (id) => {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
};

const normalizePlatform = (platform) => {
  if (!platform || typeof platform !== "string") {
    return null;
  }

  const normalizedPlatform = platform.trim().toLowerCase();

  if (!ALLOWED_PLATFORMS.includes(normalizedPlatform)) {
    return null;
  }

  return normalizedPlatform;
};

const getAllSocialLinks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        platform,
        url,
        sort_order,
        created_at,
        updated_at
      FROM social_links
      ORDER BY sort_order ASC, id ASC
    `);

    const socialLinks = result.rows.map(formatSocialLink);

    return res.status(200).json({
      success: true,
      count: socialLinks.length,
      social_links: socialLinks,
    });
  } catch (error) {
    console.error("Get social links error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve social links.",
    });
  }
};

const createSocialLink = async (req, res) => {
  try {
    const { platform, url, sort_order } = req.body;
    const normalizedPlatform = normalizePlatform(platform);

    if (!normalizedPlatform) {
      return res.status(400).json({
        success: false,
        message: "Valid social media platform is required.",
      });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Social media URL is required.",
      });
    }

    const parsedSortOrder =
      sort_order !== undefined && sort_order !== ""
        ? Number(sort_order)
        : null;

    const orderResult = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM social_links"
    );

    const nextSortOrder =
      parsedSortOrder !== null && Number.isInteger(parsedSortOrder)
        ? parsedSortOrder
        : orderResult.rows[0].next_order;

    const result = await pool.query(
      `
        INSERT INTO social_links (
          platform,
          url,
          sort_order
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          platform,
          url,
          sort_order,
          created_at,
          updated_at
      `,
      [normalizedPlatform, url.trim(), nextSortOrder]
    );

    return res.status(201).json({
      success: true,
      message: "Social link created successfully.",
      social_link: formatSocialLink(result.rows[0]),
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This social media platform already exists.",
      });
    }

    console.error("Create social link error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create social link.",
    });
  }
};

const updateSocialLink = async (req, res) => {
  try {
    const linkId = validateId(req.params.id);

    if (!linkId) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID.",
      });
    }

    const existingResult = await pool.query(
      `
        SELECT
          id,
          platform,
          url,
          sort_order
        FROM social_links
        WHERE id = $1
      `,
      [linkId]
    );

    if (existingResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Social link not found.",
      });
    }

    const existingLink = existingResult.rows[0];
    const { platform, url, sort_order } = req.body;

    const normalizedPlatform =
      platform !== undefined
        ? normalizePlatform(platform)
        : existingLink.platform;

    if (!normalizedPlatform) {
      return res.status(400).json({
        success: false,
        message: "Valid social media platform is required.",
      });
    }

    if (url !== undefined && !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Social media URL cannot be empty.",
      });
    }

    const parsedSortOrder =
      sort_order !== undefined && sort_order !== ""
        ? Number(sort_order)
        : existingLink.sort_order;

    const updatedSortOrder =
      Number.isInteger(parsedSortOrder) && parsedSortOrder >= 0
        ? parsedSortOrder
        : existingLink.sort_order;

    const result = await pool.query(
      `
        UPDATE social_links
        SET
          platform = $1,
          url = $2,
          sort_order = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING
          id,
          platform,
          url,
          sort_order,
          created_at,
          updated_at
      `,
      [
        normalizedPlatform,
        url !== undefined ? url.trim() : existingLink.url,
        updatedSortOrder,
        linkId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Social link updated successfully.",
      social_link: formatSocialLink(result.rows[0]),
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This social media platform already exists.",
      });
    }

    console.error("Update social link error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update social link.",
    });
  }
};

const deleteSocialLink = async (req, res) => {
  try {
    const linkId = validateId(req.params.id);

    if (!linkId) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM social_links
        WHERE id = $1
        RETURNING id
      `,
      [linkId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Social link not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Social link deleted successfully.",
    });
  } catch (error) {
    console.error("Delete social link error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete social link.",
    });
  }
};

module.exports = {
  getAllSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};
