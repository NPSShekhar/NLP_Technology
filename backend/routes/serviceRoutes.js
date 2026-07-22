const express = require("express");

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const uploadServiceImage = require("../middleware/uploadServiceImage");

const router = express.Router();

router.get("/", getAllServices);

router.get("/:id", getServiceById);

router.post(
  "/",
  uploadServiceImage.single("image"),
  createService
);

router.put(
  "/:id",
  uploadServiceImage.single("image"),
  updateService
);

router.delete("/:id", deleteService);

module.exports = router;