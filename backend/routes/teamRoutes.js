const express = require("express");

const {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");

const uploadTeamImage = require("../middleware/uploadTeamImage");

const router = express.Router();

// GET all team members
router.get("/", getAllTeamMembers);

// GET one team member
router.get("/:id", getTeamMemberById);

// CREATE team member
router.post(
  "/",
  uploadTeamImage.single("image"),
  createTeamMember
);

// UPDATE team member
router.put(
  "/:id",
  uploadTeamImage.single("image"),
  updateTeamMember
);

// DELETE team member
router.delete("/:id", deleteTeamMember);

module.exports = router;