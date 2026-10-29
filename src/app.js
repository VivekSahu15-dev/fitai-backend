require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1); // required on Render

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));
app.use('/api', require('./routes'));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(require('./middleware/errorHandler'));

module.exports = app;