const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Directory to store uploaded files
const uploadDir = 'uploads/';

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using crypto
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`); // Create a unique filename
  }
});

// Define the upload middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check if the file type is CSV
    const allowedTypes = /csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // File type is valid
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.')); // Invalid file type
    }
  }
});

module.exports = upload;