const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRoutes = require('./routes/uploadRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const downloadRoutes = require('./routes/downloadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', uploadRoutes);
app.use('/api', verifyRoutes);
app.use('/api', downloadRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Location-Locked File Access System API',
    endpoints: {
      upload: 'POST /api/upload',
      verify: 'POST /api/verify',
      download: 'GET /api/download/:accessId'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
