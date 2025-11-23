const path = require('path');
const { getFileStorage } = require('./uploadController');

const VERIFICATION_TIMEOUT_MS = 60 * 1000;

async function downloadFile(req, res) {
  try {
    const { accessId } = req.params;

    if (!accessId) {
      return res.status(400).json({ error: 'Access ID is required' });
    }

    const fileStorage = getFileStorage();
    const fileMetadata = fileStorage.find(file => file.accessId === accessId);

    if (!fileMetadata) {
      return res.status(404).json({ error: 'Access ID not found' });
    }

    if (!fileMetadata.verifiedAt) {
      return res.status(403).json({ error: 'Location not verified' });
    }

    const timeSinceVerification = Date.now() - new Date(fileMetadata.verifiedAt).getTime();

    if (timeSinceVerification > VERIFICATION_TIMEOUT_MS) {
      return res.status(403).json({ error: 'Location not verified' });
    }

    const filePath = path.resolve(fileMetadata.filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download file' });
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
}

module.exports = {
  downloadFile
};
