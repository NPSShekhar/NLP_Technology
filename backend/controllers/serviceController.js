const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

/**
 * Convert stored image path into complete image URL.
 *
 * Stored value:
 * /uploads/services/example.jpg
 *
 * Returned value:
 * http://localhost:5001/uploads/services/example.jpg
 */
const createImageUrl = (req, imagePath) => {
  if (!imagePath) {
    return null;
  }

  // Return external URLs without changing them
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${req.protocol}://${req.get("host")}${imagePath}`;
};

/**
 * Format service response.
 */
const formatService = (req, service) => {
  return {
    id: service.id,
    link_text: service.link_text,
    title: service.title,
    description: service.description,
    image: createImageUrl(req, service.image),
    created_at: service.created_at,
    updated_at: service.updated_at,
  };
};

/**
 * Safely delete an uploaded image.
 */
const removeImageFile = async (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return;
    }

    const projectRoot = path.resolve(__dirname, "..");
    const uploadsRoot = path.resolve(projectRoot, "uploads");

    const normalizedImagePath = imagePath.replace(/^[/\\]+/, "");

    const absoluteImagePath = path.resolve(
      projectRoot,
      normalizedImagePath
    );

    // Prevent deleting files outside uploads directory
    if (
      absoluteImagePath !== uploadsRoot &&
      !absoluteImagePath.startsWith(`${uploadsRoot}${path.sep}`)
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
      console.error("Failed to delete image:", error);
    }
  }
};

/**
 * Validate numeric service ID.
 */
const validateServiceId = (id) => {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
};

/**
 * GET /api/services
 */
const getAllServices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        link_text,
        title,
        description,
        image,
        created_at,
        updated_at
      FROM services
      ORDER BY id DESC
    `);

    const services = result.rows.map((service) =>
      formatService(req, service)
    );

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve services.",
    });
  }
};

/**
 * GET /api/services/:id
 */
const getServiceById = async (req, res) => {
  try {
    const serviceId = validateServiceId(req.params.id);

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          id,
          link_text,
          title,
          description,
          image,
          created_at,
          updated_at
        FROM services
        WHERE id = $1
      `,
      [serviceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      service: formatService(req, result.rows[0]),
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the service.",
    });
  }
};

/**
 * POST /api/services
 */
const createService = async (req, res) => {
  let uploadedImagePath = null;

  try {
    const { link_text, title, description } = req.body;

    if (req.file) {
      uploadedImagePath = `/uploads/services/${req.file.filename}`;
    }

    if (!link_text || !link_text.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Service link text is required.",
      });
    }

    if (!title || !title.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Service title is required.",
      });
    }

    if (!description || !description.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Service description is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Service image is required.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO services (
          link_text,
          title,
          description,
          image
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          link_text,
          title,
          description,
          image,
          created_at,
          updated_at
      `,
      [
        link_text.trim(),
        title.trim(),
        description.trim(),
        uploadedImagePath,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service: formatService(req, result.rows[0]),
    });
  } catch (error) {
    await removeImageFile(uploadedImagePath);

    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
    });
  }
};

/**
 * PUT /api/services/:id
 */
const updateService = async (req, res) => {
  let newImagePath = null;

  try {
    const serviceId = validateServiceId(req.params.id);

    if (!serviceId) {
      if (req.file) {
        await removeImageFile(
          `/uploads/services/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const existingResult = await pool.query(
      `
        SELECT
          id,
          link_text,
          title,
          description,
          image
        FROM services
        WHERE id = $1
      `,
      [serviceId]
    );

    if (existingResult.rowCount === 0) {
      if (req.file) {
        await removeImageFile(
          `/uploads/services/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const existingService = existingResult.rows[0];
    const { link_text, title, description } = req.body;

    if (
      link_text !== undefined &&
      !link_text.trim()
    ) {
      if (req.file) {
        await removeImageFile(
          `/uploads/services/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Service link text cannot be empty.",
      });
    }

    if (title !== undefined && !title.trim()) {
      if (req.file) {
        await removeImageFile(
          `/uploads/services/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Service title cannot be empty.",
      });
    }

    if (
      description !== undefined &&
      !description.trim()
    ) {
      if (req.file) {
        await removeImageFile(
          `/uploads/services/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Service description cannot be empty.",
      });
    }

    newImagePath = req.file
      ? `/uploads/services/${req.file.filename}`
      : existingService.image;

    const updatedLinkText =
      link_text !== undefined
        ? link_text.trim()
        : existingService.link_text;

    const updatedTitle =
      title !== undefined
        ? title.trim()
        : existingService.title;

    const updatedDescription =
      description !== undefined
        ? description.trim()
        : existingService.description;

    const result = await pool.query(
      `
        UPDATE services
        SET
          link_text = $1,
          title = $2,
          description = $3,
          image = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING
          id,
          link_text,
          title,
          description,
          image,
          created_at,
          updated_at
      `,
      [
        updatedLinkText,
        updatedTitle,
        updatedDescription,
        newImagePath,
        serviceId,
      ]
    );

    if (
      req.file &&
      existingService.image &&
      existingService.image !== newImagePath
    ) {
      await removeImageFile(existingService.image);
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service: formatService(req, result.rows[0]),
    });
  } catch (error) {
    if (req.file && newImagePath) {
      await removeImageFile(newImagePath);
    } else if (req.file) {
      await removeImageFile(
        `/uploads/services/${req.file.filename}`
      );
    }

    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service.",
    });
  }
};

/**
 * DELETE /api/services/:id
 */
const deleteService = async (req, res) => {
  try {
    const serviceId = validateServiceId(req.params.id);

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM services
        WHERE id = $1
        RETURNING
          id,
          link_text,
          image
      `,
      [serviceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    await removeImageFile(result.rows[0].image);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};