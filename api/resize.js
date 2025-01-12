const sharp = require('sharp');

module.exports = async (req, res) => {
  const file = req.files?.image;
  const width = parseInt(req.body.width, 10);
  const height = parseInt(req.body.height, 10);
  const targetSizeKB = parseInt(req.body.quality, 10);

  if (!file || isNaN(width) || isNaN(height) || isNaN(targetSizeKB)) {
    return res.status(400).send('Invalid input.');
  }

  try {
    // Start with a high quality for initial compression
    let quality = 80; 
    let resizedImage = await sharp(file.data)
      .resize(width, height)
      .jpeg({ quality })
      .toBuffer();

    // Adjust quality to meet the target size
    while (resizedImage.length / 1024 > targetSizeKB && quality > 10) {
      quality -= 5; // Reduce quality iteratively
      resizedImage = await sharp(file.data)
        .resize(width, height)
        .jpeg({ quality })
        .toBuffer();
    }

    // If the image is still too large, attempt WebP format for better compression
    if (resizedImage.length / 1024 > targetSizeKB) {
      resizedImage = await sharp(file.data)
        .resize(width, height)
        .webp({ quality: 75 }) // Use WebP format with a slightly lower quality
        .toBuffer();
    }

    if (resizedImage.length / 1024 > targetSizeKB) {
      return res
        .status(400)
        .send('Unable to achieve the target size. Try increasing the size or lowering the target size.');
    }

    res.set('Content-Type', 'image/webp'); // Set content type for WebP if used
    res.send(resizedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the image.');
  }
};
