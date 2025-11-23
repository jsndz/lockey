const { v4: uuidv4 } = require('uuid');

const fileStorage = [];

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { latitude, longitude, radius = 100 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusMeters = parseFloat(radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(radiusMeters)) {
      return res.status(400).json({ error: 'Invalid coordinates or radius' });
    }

    const accessId = uuidv4();

    const metadata = {
      accessId,
      filePath: req.file.path,
      allowedLat: lat,
      allowedLng: lng,
      radius: radiusMeters,
      verifiedAt: null
    };

    fileStorage.push(metadata);

    res.json({ accessId });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

function getFileStorage() {
  return fileStorage;
}

module.exports = {
  uploadFile,
  getFileStorage
};
