const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

// IMPORTANT:
// .env file is located at:
// /httpdocs/app/backend/.env
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const pool = require("./config/db");
const runMigrations = require("./utils/runMigrations");
const transporter = require("./config/mailer");

const serviceRoutes = require("./routes/serviceRoutes");
const teamRoutes = require("./routes/teamRoutes");
const contactRoutes = require("./routes/contactRoutes");
const popupRoutes = require("./routes/popupRoutes");
const relatedProductRoutes = require("./routes/relatedProductRoutes");
const socialLinkRoutes = require("./routes/socialLinkRoutes");

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5001;

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
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

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| UPLOADS
|--------------------------------------------------------------------------
|
| Actual folder:
|
| /httpdocs/app/backend/uploads/
|
| Public URLs:
|
| https://nlptech.netopsys.in/uploads/...
|
| https://nlptech.netopsys.in/api/uploads/...
|
| Both paths are supported.
|
|--------------------------------------------------------------------------
*/

// Original upload path
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads"),
    {
      fallthrough: true,
      index: false,
    }
  )
);

// API upload path
app.use(
  "/api/uploads",
  express.static(
    path.join(__dirname, "uploads"),
    {
      fallthrough: true,
      index: false,
    }
  )
);

/*
|--------------------------------------------------------------------------
| TEST ROUTE
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NLP services backend is running.",
  });
});

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

// Services
app.use(
  "/api/services",
  serviceRoutes
);

// Team Members
app.use(
  "/api/team-members",
  teamRoutes
);

// Contact Enquiries
app.use(
  "/api/contact-enquiries",
  contactRoutes
);

// Popup
app.use(
  "/api/popup",
  popupRoutes
);

// Related Products
app.use(
  "/api/related-products",
  relatedProductRoutes
);

// Social Links
app.use(
  "/api/social-links",
  socialLinkRoutes
);

/*
|--------------------------------------------------------------------------
| SERVE REACT FRONTEND
|--------------------------------------------------------------------------
*/

const frontendPath = path.join(
  __dirname,
  "../frontend/dist"
);

app.use(
  express.static(frontendPath)
);

/*
|--------------------------------------------------------------------------
| REACT SPA FALLBACK
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  // API route not found
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found.",
    });
  }

  // React frontend route
  res.sendFile(
    path.join(
      frontendPath,
      "index.html"
    )
  );
});

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(
  (error, req, res, next) => {
    console.error(
      "Global error:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | Multer Errors
    |--------------------------------------------------------------------------
    */

    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image size must be less than 5 MB.",
        });
      }

      if (
        error.code ===
        "LIMIT_UNEXPECTED_FILE"
      ) {
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

    /*
    |--------------------------------------------------------------------------
    | Image Validation Error
    |--------------------------------------------------------------------------
    */

    if (
      error.message ===
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CORS Error
    |--------------------------------------------------------------------------
    */

    if (
      error.message?.startsWith(
        "CORS blocked"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generic Error
    |--------------------------------------------------------------------------
    */

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
);

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | ENVIRONMENT CHECK
    |--------------------------------------------------------------------------
    */

    console.log(
      "----------------------------------------"
    );

    console.log(
      "Starting NLP Technology backend..."
    );

    console.log(
      "Environment configuration:"
    );

    console.log(
      "NODE_ENV:",
      process.env.NODE_ENV || "not set"
    );

    console.log(
      "PORT:",
      process.env.PORT || "not set, using default 5001"
    );

    console.log(
      "FRONTEND_URL:",
      process.env.FRONTEND_URL || "NOT SET"
    );

    console.log(
      "DATABASE_URL:",
      process.env.DATABASE_URL
        ? "SET"
        : "NOT SET"
    );

    console.log(
      "SMTP_USER:",
      process.env.SMTP_USER
        ? "SET"
        : "NOT SET"
    );

    console.log(
      "SMTP_APP_PASSWORD:",
      process.env.SMTP_APP_PASSWORD
        ? "SET"
        : "NOT SET"
    );

    console.log(
      "ADMIN_EMAIL:",
      process.env.ADMIN_EMAIL
        ? "SET"
        : "NOT SET"
    );

    console.log(
      "MAIL_FROM:",
      process.env.MAIL_FROM
        ? "SET"
        : "NOT SET"
    );

    console.log(
      "----------------------------------------"
    );

    /*
    |--------------------------------------------------------------------------
    | REQUIRED SMTP VARIABLES
    |--------------------------------------------------------------------------
    */

    if (!process.env.SMTP_USER) {
      throw new Error(
        "SMTP_USER is not configured."
      );
    }

    if (!process.env.SMTP_APP_PASSWORD) {
      throw new Error(
        "SMTP_APP_PASSWORD is not configured."
      );
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error(
        "ADMIN_EMAIL is not configured."
      );
    }

    if (!process.env.MAIL_FROM) {
      throw new Error(
        "MAIL_FROM is not configured."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | TEST DATABASE CONNECTION
    |--------------------------------------------------------------------------
    */

    await pool.query(
      "SELECT NOW()"
    );

    console.log(
      "Database connection successful."
    );

    /*
    |--------------------------------------------------------------------------
    | TEST SMTP CONNECTION
    |--------------------------------------------------------------------------
    */

    console.log(
      "Checking SMTP connection..."
    );

    await transporter.verify();

    console.log(
      "SMTP connection verified successfully."
    );

    /*
    |--------------------------------------------------------------------------
    | RUN DATABASE MIGRATIONS
    |--------------------------------------------------------------------------
    */

    await runMigrations();

    console.log(
      "Database migrations completed successfully."
    );

    /*
    |--------------------------------------------------------------------------
    | START EXPRESS SERVER
    |--------------------------------------------------------------------------
    */

    app.listen(
      PORT,
      () => {
        console.log(
          "----------------------------------------"
        );

        console.log(
          `Server running at http://localhost:${PORT}`
        );

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

        console.log(
          `Related Products API: http://localhost:${PORT}/api/related-products`
        );

        console.log(
          `Social Links API: http://localhost:${PORT}/api/social-links`
        );

        console.log(
          `Uploads: http://localhost:${PORT}/uploads`
        );

        console.log(
          `API Uploads: http://localhost:${PORT}/api/uploads`
        );

        console.log(
          "----------------------------------------"
        );
      }
    );
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | STARTUP ERROR
    |--------------------------------------------------------------------------
    */

    console.error(
      "========================================"
    );

    console.error(
      "SERVER STARTUP FAILED"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "Command:",
      error.command
    );

    console.error(
      "Response:",
      error.response
    );

    console.error(
      "Response Code:",
      error.responseCode
    );

    console.error(
      "========================================"
    );

    process.exit(1);
  }
};

startServer();