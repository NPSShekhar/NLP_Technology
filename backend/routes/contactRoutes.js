const express = require("express");

const {
  createContactEnquiry,
  getAllContactEnquiries,
} = require("../controllers/contactController");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = express.Router();

router.post("/", upload.single("file"), createContactEnquiry);

router.get("/", getAllContactEnquiries);

module.exports = router;