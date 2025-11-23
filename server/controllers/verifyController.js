const { calculateDistance } = require('../utils/haversine');
const { getFileStorage } = require('./uploadController');

async function verifyLocation(req, res) {
  try {
    const { accessId, lat, lng } = req.body;

    if (!accessId || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'accessId, lat, and lng are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const fileStorage = getFileStorage();
    const fileMetadata = fileStorage.find(file => file.accessId === accessId);

    if (!fileMetadata) {
      return res.status(404).json({ error: 'Access ID not found' });
    }

    const distance = calculateDistance(
      fileMetadata.allowedLat,
      fileMetadata.allowedLng,
      latitude,
      longitude
    );

    if (distance <= fileMetadata.radius) {
      fileMetadata.verifiedAt = new Date();

      return res.json({ allowed: true });
    } else {
      return res.json({
        allowed: false,
        distance: parseFloat(distance.toFixed(1))
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify location' });
  }
}

module.exports = {
  verifyLocation
};
