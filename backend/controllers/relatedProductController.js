const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const createImageUrl = (req, imagePath) => {
  if (!imagePath) {
    return null;
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${req.protocol}://${req.get("host")}${imagePath}`;
};

const formatRelatedProduct = (req, product) => {
  return {
    id: product.id,
    service_id: product.service_id,
    title: product.title,
    description: product.description,
    image: createImageUrl(req, product.image),
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
};

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

const validateId = (id) => {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
};

const getAllRelatedProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        service_id,
        title,
        description,
        image,
        created_at,
        updated_at
      FROM related_products
      ORDER BY id ASC
    `);

    const relatedProducts = result.rows.map((product) =>
      formatRelatedProduct(req, product)
    );

    return res.status(200).json({
      success: true,
      count: relatedProducts.length,
      related_products: relatedProducts,
    });
  } catch (error) {
    console.error("Get related products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve related products.",
    });
  }
};

const createRelatedProduct = async (req, res) => {
  let uploadedImagePath = null;

  try {
    const { service_id, title, description } = req.body;

    if (req.file) {
      uploadedImagePath = `/uploads/related-products/${req.file.filename}`;
    }

    const serviceId = validateId(service_id);

    if (!serviceId) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Valid product & service category is required.",
      });
    }

    if (!title || !title.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!description || !description.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Product description is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required.",
      });
    }

    const serviceResult = await pool.query(
      "SELECT id FROM services WHERE id = $1",
      [serviceId]
    );

    if (serviceResult.rowCount === 0) {
      await removeImageFile(uploadedImagePath);

      return res.status(404).json({
        success: false,
        message: "Selected product & service category not found.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO related_products (
          service_id,
          title,
          description,
          image
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          service_id,
          title,
          description,
          image,
          created_at,
          updated_at
      `,
      [
        serviceId,
        title.trim(),
        description.trim(),
        uploadedImagePath,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Related product created successfully.",
      related_product: formatRelatedProduct(req, result.rows[0]),
    });
  } catch (error) {
    await removeImageFile(uploadedImagePath);

    console.error("Create related product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create related product.",
    });
  }
};

const updateRelatedProduct = async (req, res) => {
  let newImagePath = null;

  try {
    const productId = validateId(req.params.id);

    if (!productId) {
      if (req.file) {
        await removeImageFile(
          `/uploads/related-products/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Invalid related product ID.",
      });
    }

    const existingResult = await pool.query(
      `
        SELECT
          id,
          service_id,
          title,
          description,
          image
        FROM related_products
        WHERE id = $1
      `,
      [productId]
    );

    if (existingResult.rowCount === 0) {
      if (req.file) {
        await removeImageFile(
          `/uploads/related-products/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,
        message: "Related product not found.",
      });
    }

    const existingProduct = existingResult.rows[0];
    const { service_id, title, description } = req.body;

    const serviceId =
      service_id !== undefined
        ? validateId(service_id)
        : existingProduct.service_id;

    if (!serviceId) {
      if (req.file) {
        await removeImageFile(
          `/uploads/related-products/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Valid product & service category is required.",
      });
    }

    if (title !== undefined && !title.trim()) {
      if (req.file) {
        await removeImageFile(
          `/uploads/related-products/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Product name cannot be empty.",
      });
    }

    if (description !== undefined && !description.trim()) {
      if (req.file) {
        await removeImageFile(
          `/uploads/related-products/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Product description cannot be empty.",
      });
    }

    if (service_id !== undefined) {
      const serviceResult = await pool.query(
        "SELECT id FROM services WHERE id = $1",
        [serviceId]
      );

      if (serviceResult.rowCount === 0) {
        if (req.file) {
          await removeImageFile(
            `/uploads/related-products/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message: "Selected product & service category not found.",
        });
      }
    }

    newImagePath = req.file
      ? `/uploads/related-products/${req.file.filename}`
      : existingProduct.image;

    const result = await pool.query(
      `
        UPDATE related_products
        SET
          service_id = $1,
          title = $2,
          description = $3,
          image = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING
          id,
          service_id,
          title,
          description,
          image,
          created_at,
          updated_at
      `,
      [
        serviceId,
        title !== undefined ? title.trim() : existingProduct.title,
        description !== undefined
          ? description.trim()
          : existingProduct.description,
        newImagePath,
        productId,
      ]
    );

    if (
      req.file &&
      existingProduct.image &&
      existingProduct.image !== newImagePath
    ) {
      await removeImageFile(existingProduct.image);
    }

    return res.status(200).json({
      success: true,
      message: "Related product updated successfully.",
      related_product: formatRelatedProduct(req, result.rows[0]),
    });
  } catch (error) {
    if (req.file && newImagePath) {
      await removeImageFile(newImagePath);
    } else if (req.file) {
      await removeImageFile(
        `/uploads/related-products/${req.file.filename}`
      );
    }

    console.error("Update related product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update related product.",
    });
  }
};

const deleteRelatedProduct = async (req, res) => {
  try {
    const productId = validateId(req.params.id);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid related product ID.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM related_products
        WHERE id = $1
        RETURNING id, image
      `,
      [productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Related product not found.",
      });
    }

    await removeImageFile(result.rows[0].image);

    return res.status(200).json({
      success: true,
      message: "Related product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete related product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete related product.",
    });
  }
};

module.exports = {
  getAllRelatedProducts,
  createRelatedProduct,
  updateRelatedProduct,
  deleteRelatedProduct,
};
