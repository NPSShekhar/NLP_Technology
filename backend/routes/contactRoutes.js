const express = require("express");

const {
  getContactFile,
  createContactEnquiry,
  getAllContactEnquiries,
  deleteContactEnquiry,
} = require("../controllers/contactController");
const requireAdmin = require("../middleware/requireAdmin");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = express.Router();

router.post("/", verifyRecaptcha("enquiry_submit"), upload.single("file"), createContactEnquiry);

router.post("/access", verifyRecaptcha("admin_login"), requireAdmin, (req, res) => res.json({ success: true }));
router.get("/", requireAdmin, getAllContactEnquiries);
router.get("/:id/file", requireAdmin, getContactFile);
router.delete("/:id", requireAdmin, deleteContactEnquiry);

module.exports = router;
