const express = require("express");

const {
  createContactEnquiry,
  getAllContactEnquiries,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContactEnquiry);

router.get("/", getAllContactEnquiries);

module.exports = router;