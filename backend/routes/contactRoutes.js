const express = require("express");

const {
  createContactEnquiry,
  getAllContactEnquiries,
  deleteContactEnquiry,
} = require("../controllers/contactController");
const requireAdmin = require("../middleware/requireAdmin");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = express.Router();

router.post("/", upload.single("file"), createContactEnquiry);

router.post("/access", requireAdmin, (req, res) => res.json({ success: true }));
router.get("/", requireAdmin, getAllContactEnquiries);
router.delete("/:id", requireAdmin, deleteContactEnquiry);

module.exports = router;
