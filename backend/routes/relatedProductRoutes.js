const express = require("express");

const {
  getAllRelatedProducts,
  createRelatedProduct,
  updateRelatedProduct,
  deleteRelatedProduct,
} = require("../controllers/relatedProductController");

const uploadRelatedProductImage = require("../middleware/uploadRelatedProductImage");

const router = express.Router();

router.get("/", getAllRelatedProducts);

router.post(
  "/",
  uploadRelatedProductImage.single("image"),
  createRelatedProduct
);

router.put(
  "/:id",
  uploadRelatedProductImage.single("image"),
  updateRelatedProduct
);

router.delete("/:id", deleteRelatedProduct);

module.exports = router;
