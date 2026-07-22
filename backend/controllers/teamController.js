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

const formatTeamMember = (req, member) => {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    image: createImageUrl(req, member.image),
    created_at: member.created_at,
    updated_at: member.updated_at,
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
      console.error("Failed to delete team image:", error);
    }
  }
};

const validateMemberId = (id) => {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
};

/**
 * GET /api/team-members
 */
const getAllTeamMembers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        role,
        image,
        created_at,
        updated_at
      FROM team_members
      ORDER BY id ASC
    `);

    const teamMembers = result.rows.map((member) =>
      formatTeamMember(req, member)
    );

    return res.status(200).json({
      success: true,
      count: teamMembers.length,
      team_members: teamMembers,
    });
  } catch (error) {
    console.error("Get team members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve team members.",
    });
  }
};

/**
 * GET /api/team-members/:id
 */
const getTeamMemberById = async (req, res) => {
  try {
    const memberId = validateMemberId(req.params.id);

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          id,
          name,
          role,
          image,
          created_at,
          updated_at
        FROM team_members
        WHERE id = $1
      `,
      [memberId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      team_member: formatTeamMember(req, result.rows[0]),
    });
  } catch (error) {
    console.error("Get team member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve team member.",
    });
  }
};

/**
 * POST /api/team-members
 */
const createTeamMember = async (req, res) => {
  let uploadedImagePath = null;

  try {
    const { name, role } = req.body;

    if (req.file) {
      uploadedImagePath = `/uploads/team/${req.file.filename}`;
    }

    if (!name || !name.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Team member name is required.",
      });
    }

    if (!role || !role.trim()) {
      await removeImageFile(uploadedImagePath);

      return res.status(400).json({
        success: false,
        message: "Team member role is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Team member image is required.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO team_members (
          name,
          role,
          image
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          role,
          image,
          created_at,
          updated_at
      `,
      [
        name.trim(),
        role.trim(),
        uploadedImagePath,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Team member created successfully.",
      team_member: formatTeamMember(req, result.rows[0]),
    });
  } catch (error) {
    await removeImageFile(uploadedImagePath);

    console.error("Create team member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create team member.",
    });
  }
};

/**
 * PUT /api/team-members/:id
 */
const updateTeamMember = async (req, res) => {
  let newImagePath = null;

  try {
    const memberId = validateMemberId(req.params.id);

    if (req.file) {
      newImagePath = `/uploads/team/${req.file.filename}`;
    }

    if (!memberId) {
      await removeImageFile(newImagePath);

      return res.status(400).json({
        success: false,
        message: "Invalid team member ID.",
      });
    }

    const existingResult = await pool.query(
      `
        SELECT
          id,
          name,
          role,
          image
        FROM team_members
        WHERE id = $1
      `,
      [memberId]
    );

    if (existingResult.rowCount === 0) {
      await removeImageFile(newImagePath);

      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    const existingMember = existingResult.rows[0];
    const { name, role } = req.body;

    if (name !== undefined && !name.trim()) {
      await removeImageFile(newImagePath);

      return res.status(400).json({
        success: false,
        message: "Team member name cannot be empty.",
      });
    }

    if (role !== undefined && !role.trim()) {
      await removeImageFile(newImagePath);

      return res.status(400).json({
        success: false,
        message: "Team member role cannot be empty.",
      });
    }

    const updatedName =
      name !== undefined
        ? name.trim()
        : existingMember.name;

    const updatedRole =
      role !== undefined
        ? role.trim()
        : existingMember.role;

    const updatedImage =
      newImagePath || existingMember.image;

    const result = await pool.query(
      `
        UPDATE team_members
        SET
          name = $1,
          role = $2,
          image = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING
          id,
          name,
          role,
          image,
          created_at,
          updated_at
      `,
      [
        updatedName,
        updatedRole,
        updatedImage,
        memberId,
      ]
    );

    if (
      req.file &&
      existingMember.image &&
      existingMember.image !== updatedImage
    ) {
      await removeImageFile(existingMember.image);
    }

    return res.status(200).json({
      success: true,
      message: "Team member updated successfully.",
      team_member: formatTeamMember(req, result.rows[0]),
    });
  } catch (error) {
    await removeImageFile(newImagePath);

    console.error("Update team member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update team member.",
    });
  }
};

/**
 * DELETE /api/team-members/:id
 */
const deleteTeamMember = async (req, res) => {
  try {
    const memberId = validateMemberId(req.params.id);

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM team_members
        WHERE id = $1
        RETURNING
          id,
          image
      `,
      [memberId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    await removeImageFile(result.rows[0].image);

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully.",
    });
  } catch (error) {
    console.error("Delete team member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete team member.",
    });
  }
};

module.exports = {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};