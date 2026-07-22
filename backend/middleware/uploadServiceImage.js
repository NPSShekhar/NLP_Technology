const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "services"
);

// Create uploads/services directory automatically
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;

    callback(null, uniqueFileName);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (req, file, callback) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();

  const validMimeType = allowedMimeTypes.includes(file.mimetype);
  const validExtension = allowedExtensions.includes(fileExtension);

  if (!validMimeType || !validExtension) {
    return callback(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed.")
    );
  }

  callback(null, true);
};

const uploadServiceImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = uploadServiceImage;