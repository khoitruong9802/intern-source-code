const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const initRoutes = require('./routes/index');
const { createServer } = require('http'); // Import http for creating the server
const socket = require('./config/socket'); // Import the WebSocket setup function

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5500'], // React app URL
    credentials: true, // Enable sending cookies
  })
);

const PORT = process.env.PORT || 5000;

// Initialize routes
initRoutes(app);

// Create an HTTP server
const server = createServer(app);

// Set up the WebSocket server
socket.setupSocketServer(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
