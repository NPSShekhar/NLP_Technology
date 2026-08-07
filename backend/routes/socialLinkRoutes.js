const express = require("express");
const {
  getAllSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} = require("../controllers/socialLinkController");

const router = express.Router();

router.get("/", getAllSocialLinks);
router.post("/", createSocialLink);
router.put("/:id", updateSocialLink);
router.delete("/:id", deleteSocialLink);

module.exports = router;
