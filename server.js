const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 3000;

// Storage configuration to use temporary storage in serverless environments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = '/tmp'; // Use Vercel's /tmp directory for temporary files
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Middleware to handle form data parsing for width and height
app.use(express.urlencoded({ extended: true }));

// API route to handle image resizing
app.post('/api/resize', upload.single('image'), async (req, res) => {
  try {
    // Ensure width and height are passed in the form data
    const { width, height } = req.body;
    if (!width || !height) {
      return res.status(400).send("Width and height are required.");
    }

    console.log(`Received request to resize image to width: ${width}, height: ${height}`);
    const outputPath = path.join('/tmp', `resized-${req.file.filename}`);
    console.log(`Processing file at: ${req.file.path}`);

    // Resize the image using Sharp
    await sharp(req.file.path)
      .resize(parseInt(width), parseInt(height))
      .toFile(outputPath);

    // Read the processed image and send it back to the client
    const fileBuffer = fs.readFileSync(outputPath);
    console.log(`Image resized successfully. Sending back...`);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).send('Error resizing image');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
