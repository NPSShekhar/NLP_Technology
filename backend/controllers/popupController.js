const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Create public image URL
|--------------------------------------------------------------------------
| Database may contain:
|
| /uploads/popup/image.jpg
| http://nlptech.netopsys.in/uploads/popup/image.jpg
| https://nlptech.netopsys.in/uploads/popup/image.jpg
|
| Always return:
|
| https://nlptech.netopsys.in/api/uploads/popup/image.jpg
|--------------------------------------------------------------------------
*/

const createImageUrl = (req, imagePath) => {
  if (!imagePath) {
    return null;
  }

  const imageValue = String(imagePath).trim();

  if (!imageValue) {
    return null;
  }

  /*
   * If database already contains a full URL,
   * normalize it properly.
   */
  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    try {
      const url = new URL(imageValue);

      /*
       * For our domain, always force HTTPS
       * and use /api/uploads/.
       */
      if (url.hostname === "nlptech.netopsys.in") {
        url.protocol = "https:";

        const pathname = url.pathname.replace(
          /^\/api\/uploads\//,
          "/uploads/"
        );

        url.pathname = `/api/uploads/${pathname.replace(
          /^\/uploads\//,
          ""
        )}`;

        return url.toString();
      }

      /*
       * If it is some other external URL,
       * return it unchanged.
       */
      return imageValue;
    } catch (error) {
      console.error("Invalid image URL:", imageValue);
      return imageValue;
    }
  }

  /*
   * Normalize relative database paths.
   *
   * /uploads/popup/image.jpg
   *       ↓
   * /api/uploads/popup/image.jpg
   */
  const normalizedPath = imageValue
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const cleanPath = normalizedPath.startsWith("uploads/")
    ? normalizedPath.substring("uploads/".length)
    : normalizedPath.startsWith("api/uploads/")
    ? normalizedPath.substring("api/uploads/".length)
    : normalizedPath;

  /*
   * Production domain.
   */
  if (
    req.get("host") === "nlptech.netopsys.in" ||
    req.get("host")?.startsWith("nlptech.netopsys.in:")
  ) {
    return `https://nlptech.netopsys.in/api/uploads/${cleanPath}`;
  }

  /*
   * Local development fallback.
   */
  const protocol =
    req.get("x-forwarded-proto") ||
    req.protocol ||
    "http";

  const host = req.get("host");

  return `${protocol}://${host}/api/uploads/${cleanPath}`;
};


/*
|--------------------------------------------------------------------------
| Format popup response
|--------------------------------------------------------------------------
*/

const formatPopup = (req, popup) => {
  return {
    id: popup.id,
    image: createImageUrl(req, popup.image),
    width: popup.width,
    height: popup.height,
    is_active: popup.is_active,
    created_at: popup.created_at,
    updated_at: popup.updated_at,
  };
};


/*
|--------------------------------------------------------------------------
| Remove uploaded image file
|--------------------------------------------------------------------------
*/

const removeImageFile = async (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    /*
     * If imagePath is a URL, extract only its pathname.
     *
     * This is important because old database records
     * may contain:
     *
     * http://nlptech.netopsys.in/uploads/...
     *
     * or
     *
     * https://nlptech.netopsys.in/api/uploads/...
     */
    let normalizedImagePath = imagePath;

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      try {
        const url = new URL(imagePath);
        normalizedImagePath = url.pathname;
      } catch (error) {
        console.error(
          "Invalid image URL while deleting:",
          imagePath
        );
        return;
      }
    }

    /*
     * Convert API URL back to physical uploads path.
     *
     * /api/uploads/popup/image.jpg
     *       ↓
     * /uploads/popup/image.jpg
     */
    normalizedImagePath = normalizedImagePath
      .replace(/^\/api\/uploads\//, "/uploads/")
      .replace(/^\/+/, "");

    /*
     * Make sure only files inside /uploads are deleted.
     */
    const projectRoot = path.resolve(__dirname, "..");

    const uploadsRoot = path.resolve(
      projectRoot,
      "uploads"
    );

    const absoluteImagePath = path.resolve(
      projectRoot,
      normalizedImagePath
    );

    /*
     * Security check.
     */
    if (
      absoluteImagePath !== uploadsRoot &&
      !absoluteImagePath.startsWith(
        `${uploadsRoot}${path.sep}`
      )
    ) {
      console.error(
        "Invalid image deletion path:",
        absoluteImagePath
      );

      return;
    }

    await fs.promises.unlink(absoluteImagePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        "Failed to delete popup image:",
        error
      );
    }
  }
};


/*
|--------------------------------------------------------------------------
| Validate Popup ID
|--------------------------------------------------------------------------
*/

const validatePopupId = (id) => {
  const numericId = Number(id);

  if (
    !Number.isInteger(numericId) ||
    numericId <= 0
  ) {
    return null;
  }

  return numericId;
};


/*
|--------------------------------------------------------------------------
| Validate Popup Dimensions
|--------------------------------------------------------------------------
*/

const validateDimensions = (width, height) => {
  const numericWidth = Number(width);
  const numericHeight = Number(height);

  if (
    !Number.isInteger(numericWidth) ||
    numericWidth <= 0 ||
    !Number.isInteger(numericHeight) ||
    numericHeight <= 0
  ) {
    return null;
  }

  return {
    width: numericWidth,
    height: numericHeight,
  };
};


/*
|--------------------------------------------------------------------------
| GET /api/popup/active
|--------------------------------------------------------------------------
*/

const getActivePopup = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        image,
        width,
        height,
        is_active,
        created_at,
        updated_at
      FROM popup_banners
      WHERE is_active = TRUE
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rowCount === 0) {
      return res.status(200).json({
        success: true,
        popup: null,
      });
    }

    return res.status(200).json({
      success: true,
      popup: formatPopup(
        req,
        result.rows[0]
      ),
    });
  } catch (error) {
    console.error(
      "Get active popup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve active popup.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET /api/popup
|--------------------------------------------------------------------------
*/

const getAllPopups = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        image,
        width,
        height,
        is_active,
        created_at,
        updated_at
      FROM popup_banners
      ORDER BY id DESC
    `);

    const popups = result.rows.map((popup) =>
      formatPopup(req, popup)
    );

    return res.status(200).json({
      success: true,
      count: popups.length,
      popups,
    });
  } catch (error) {
    console.error(
      "Get popups error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve popups.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| POST /api/popup
|--------------------------------------------------------------------------
*/

const createPopup = async (req, res) => {
  let uploadedImagePath = null;

  try {
    const { width, height } = req.body;

    const dimensions = validateDimensions(
      width,
      height
    );

    if (req.file) {
      uploadedImagePath =
        `/uploads/popup/${req.file.filename}`;
    }

    if (!dimensions) {
      await removeImageFile(
        uploadedImagePath
      );

      return res.status(400).json({
        success: false,
        message:
          "Valid popup width and height are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Popup image is required.",
      });
    }

    const activeCountResult =
      await pool.query(`
        SELECT COUNT(*)::INT AS total
        FROM popup_banners
      `);

    const shouldActivate =
      activeCountResult.rows[0].total === 0;

    const result = await pool.query(
      `
        INSERT INTO popup_banners (
          image,
          width,
          height,
          is_active
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          image,
          width,
          height,
          is_active,
          created_at,
          updated_at
      `,
      [
        uploadedImagePath,
        dimensions.width,
        dimensions.height,
        shouldActivate,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Popup created successfully.",
      popup: formatPopup(
        req,
        result.rows[0]
      ),
    });
  } catch (error) {
    await removeImageFile(
      uploadedImagePath
    );

    console.error(
      "Create popup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create popup.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| PUT /api/popup/:id
|--------------------------------------------------------------------------
*/

const updatePopup = async (req, res) => {
  let newImagePath = null;

  try {
    const popupId = validatePopupId(
      req.params.id
    );

    if (!popupId) {
      if (req.file) {
        await removeImageFile(
          `/uploads/popup/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Invalid popup ID.",
      });
    }

    const existingResult =
      await pool.query(
        `
          SELECT
            id,
            image,
            width,
            height,
            is_active
          FROM popup_banners
          WHERE id = $1
        `,
        [popupId]
      );

    if (existingResult.rowCount === 0) {
      if (req.file) {
        await removeImageFile(
          `/uploads/popup/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    const existingPopup =
      existingResult.rows[0];

    const { width, height } = req.body;

    const updatedWidth =
      width !== undefined
        ? Number(width)
        : existingPopup.width;

    const updatedHeight =
      height !== undefined
        ? Number(height)
        : existingPopup.height;

    const dimensions =
      validateDimensions(
        updatedWidth,
        updatedHeight
      );

    if (!dimensions) {
      if (req.file) {
        await removeImageFile(
          `/uploads/popup/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "Valid popup width and height are required.",
      });
    }

    newImagePath = req.file
      ? `/uploads/popup/${req.file.filename}`
      : existingPopup.image;

    const result = await pool.query(
      `
        UPDATE popup_banners
        SET
          image = $1,
          width = $2,
          height = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING
          id,
          image,
          width,
          height,
          is_active,
          created_at,
          updated_at
      `,
      [
        newImagePath,
        dimensions.width,
        dimensions.height,
        popupId,
      ]
    );

    /*
     * Delete old image only when
     * a new image was uploaded.
     */
    if (
      req.file &&
      existingPopup.image &&
      existingPopup.image !== newImagePath
    ) {
      await removeImageFile(
        existingPopup.image
      );
    }

    return res.status(200).json({
      success: true,
      message: "Popup updated successfully.",
      popup: formatPopup(
        req,
        result.rows[0]
      ),
    });
  } catch (error) {
    if (req.file && newImagePath) {
      await removeImageFile(
        newImagePath
      );
    } else if (req.file) {
      await removeImageFile(
        `/uploads/popup/${req.file.filename}`
      );
    }

    console.error(
      "Update popup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update popup.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE /api/popup/:id
|--------------------------------------------------------------------------
*/

const deletePopup = async (req, res) => {
  try {
    const popupId = validatePopupId(
      req.params.id
    );

    if (!popupId) {
      return res.status(400).json({
        success: false,
        message: "Invalid popup ID.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM popup_banners
        WHERE id = $1
        RETURNING
          id,
          image
      `,
      [popupId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    await removeImageFile(
      result.rows[0].image
    );

    return res.status(200).json({
      success: true,
      message: "Popup deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete popup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete popup.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| PATCH /api/popup/:id/show
|--------------------------------------------------------------------------
*/

const showPopup = async (req, res) => {
  try {
    const popupId = validatePopupId(
      req.params.id
    );

    if (!popupId) {
      return res.status(400).json({
        success: false,
        message: "Invalid popup ID.",
      });
    }

    const existingResult =
      await pool.query(
        `
          SELECT id
          FROM popup_banners
          WHERE id = $1
        `,
        [popupId]
      );

    if (existingResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    /*
     * Hide all other popups.
     */
    await pool.query(`
      UPDATE popup_banners
      SET
        is_active = FALSE,
        updated_at = CURRENT_TIMESTAMP
      WHERE is_active = TRUE
    `);

    const result = await pool.query(
      `
        UPDATE popup_banners
        SET
          is_active = TRUE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
          id,
          image,
          width,
          height,
          is_active,
          created_at,
          updated_at
      `,
      [popupId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Popup is now shown on the website.",
      popup: formatPopup(
        req,
        result.rows[0]
      ),
    });
  } catch (error) {
    console.error(
      "Show popup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to show popup on the website.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| PATCH /api/popup/:id/hide
|--------------------------------------------------------------------------
*/

const hidePopup = async (req, res) => {
  try {
    const popupId = validatePopupId(
      req.params.id
    );

    if (!popupId) {
      return res.status(400).json({
        success: false,
        message: "Invalid popup ID.",
      });
    }

    const existingResult =
      await pool.query(
        `
          SELECT
            id,
            is_active
          FROM popup_banners
          WHERE id = $1
        `,
        [popupId]
      );

    if (existingResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    const result = await pool.query(
      `
        UPDATE popup_banners
        SET
          is_active = FALSE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
          id,
          image,
          width,
          height,
          is_active,
          created_at,
          updated_at
      `,
      [popupId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Popup is no longer shown on the website.",
      popup: formatPopup(
        req,
        result.rows[0]
      ),
    });
  } catch (error) {
    console.error(
      "Hide popup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to hide popup on the website.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  getActivePopup,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
  showPopup,
  hidePopup,
};