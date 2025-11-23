const express = require('express');
const { verifyLocation } = require('../controllers/verifyController');

const router = express.Router();

router.post('/verify', verifyLocation);

module.exports = router;
