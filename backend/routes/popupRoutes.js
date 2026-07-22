const express = require("express");

const {
  getActivePopup,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
  showPopup,
  hidePopup,
} = require("../controllers/popupController");

const uploadPopupImage = require("../middleware/uploadPopupImage");

const router = express.Router();

router.get("/active", getActivePopup);

router.get("/", getAllPopups);

router.post(
  "/",
  uploadPopupImage.single("image"),
  createPopup
);

router.put(
  "/:id",
  uploadPopupImage.single("image"),
  updatePopup
);

router.patch("/:id/show", showPopup);
router.patch("/:id/hide", hidePopup);

router.delete("/:id", deletePopup);

module.exports = router;
