const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const pool = require("./config/db");
const serviceRoutes = require("./routes/serviceRoutes");
const teamRoutes = require("./routes/teamRoutes");
const contactRoutes = require("./routes/contactRoutes");
const popupRoutes = require("./routes/popupRoutes");

const app = express();

const PORT = process.env.PORT || 5001;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) =>
      origin.trim()
    )
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server requests and mobile applications
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked request from ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Make uploaded images publicly accessible
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NLP services backend is running.",
  });
});

// Service API routes
app.use("/api/services", serviceRoutes);
app.use("/api/team-members", teamRoutes);

app.use(
  "/api/contact-enquiries",
  contactRoutes
);

app.use("/api/popup", popupRoutes);

// Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size must be less than 5 MB.",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid image field. Use 'image' as the file field name.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (
    error.message ===
    "Only JPG, JPEG, PNG and WEBP images are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message?.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(
        `Services API: http://localhost:${PORT}/api/services`
      );

  console.log(
    `Team API: http://localhost:${PORT}/api/team-members`
  );

  console.log(
    `Contact API: http://localhost:${PORT}/api/contact-enquiries`
  );

  console.log(
    `Popup API: http://localhost:${PORT}/api/popup`
  );
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();