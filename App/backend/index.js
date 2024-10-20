// tech stack: Node.js with Express and MongoDB
// const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Client } = require("@googlemaps/google-maps-services-js");

const fs = require('fs');

require('dotenv').config();

// Middleware
app.use(express.json()); // For parsing application/json


// Read allowed origins from environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: (origin, callback) => {
    console.log("Incoming request from origin:", origin);
    if (!origin) return callback(null, true); // Allow requests with no origin (e.g., mobile apps, CURL)

    // Check if the request's origin is in the allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
}));

// handle preflight requests globally
app.options('*', cors()); 

// Import routes
const truckRoutes = require('./routes/trucks');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const placeRoutes = require('./routes/places');
const newsletterRoutes = require('./routes/newsletter');

// Read secrets from Docker secrets files
const apiKey = fs.readFileSync('/run/secrets/GOOGLE_MAPS_API_KEY', 'utf8').trim();
const dbUrl = fs.readFileSync('/run/secrets/DATABASE_URL', 'utf8').trim();
const port = fs.readFileSync('/run/secrets/PORT', 'utf8').trim() || 4000; // Default to 4000 if PORT is not set

// admin account: admin admin2333
mongoose.connect(dbUrl)


// Serve static files from the "upload/images" directory
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Use routes
app.use('/api/trucks', truckRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/newsletter', newsletterRoutes);


// Basic route
app.get("/", (req, res) => {
    res.send("Express App is running");
  });

// Generic error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});



app.listen(port, '0.0.0.0', (error) => {
    if (!error){
        console.log(`Server is running on port ${port}`)
    } else {
        console.log("Error: " + error);
    }
})
