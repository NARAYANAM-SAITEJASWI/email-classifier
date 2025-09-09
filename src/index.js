require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Serve the frontend for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-email-verifier';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running (without DB) on ${PORT}`));
  });
