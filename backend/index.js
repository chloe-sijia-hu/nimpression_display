// tech stack: Node.js with Express and MongoDB
// const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Client } = require("@googlemaps/google-maps-services-js");

require('dotenv').config();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors());

// Import routes
const truckRoutes = require('./routes/trucks');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const placeRoutes = require('./routes/places');

// Access environment variables
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
const dbUrl = process.env.DATABASE_URL;
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set

const client = new Client({});


// admin account: admin admin2333
mongoose.connect(dbUrl)


// Serve static files from the "upload/images" directory
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Use routes
app.use('/api/trucks', truckRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);



// Basic route
app.get("/", (req, res) => {
    res.send("Express App is running");
  });


// Error handling
// app.use((req, res) => {
//   res.status(404).send('<!DOCTYPE html><html><body>Page Not Found</body></html>');
// });

// Generic error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});



app.listen(port, (error) => {
    if (!error){
        console.log(`Server is running on port ${port}`)
    } else {
        console.log("Error: " + error);
    }
})
