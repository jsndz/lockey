const express = require('express');
const { downloadFile } = require('../controllers/downloadController');

const router = express.Router();

router.get('/download/:accessId', downloadFile);

module.exports = router;
