const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes');
const mainRoute = require('./routes'); 

// Import middleware
// const logger = require('./middlewares/logger');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(logger);

// app.get('/hello', (req, res) => {
//   console.log('Route /hello called');
//   res.send({ message: 'hello user I am here' });
// });

// Register Main Routes
app.use('/', mainRoute);

// // Register routes
// app.use('/api', authRoutes);         // /api/register, /api/login
// app.use('/api/books', bookRoutes);   // All /api/books routes are protected

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
