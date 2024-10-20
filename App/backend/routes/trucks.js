const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');
const multer = require("multer");
const path = require("path");
const jwt = require('jsonwebtoken');
const fs = require('fs');


const port = fs.readFileSync('/run/secrets/PORT', 'utf8').trim();
const jwt_secret = fs.readFileSync('/run/secrets/JWT_SECRET', 'utf8').trim();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }
    console.log('Decoded token payload:', user);
    req.user = user; // Attach the user to the request object
    console.log("user: ", req.user);
    next();
  });
};

// Role-based access middleware that allows multiple roles
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };
};

// Image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating api for getting all trucks
router.get("/alltrucks", async (req, res) => {
  try {
    const trucks = await Truck.find({});
    res.json(trucks);
  } catch (error) {
    console.error("Error fetching trucks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// creating api for removing trucks
router.post('/removetruck', authenticateToken, authorizeRole('admin'), async(req, res) => {
  await Truck.findOneAndDelete({id: req.body.id});
  console.log("Deleted");
  res.json({
    success: true,
    name: req.body.name,
  })
})

// creating api for add truckss
router.post("/addtruck", authenticateToken, authorizeRole('admin'), async (req, res) => {
  let trucks = await Truck.find({});
  let id;
  if (trucks.length > 0) {
    let last_truck_array = trucks.slice(-1);
    let last_truck = last_truck_array[0];
    id = last_truck.id + 1;
  } else {
    id = 1;
  }

  const truck = new Truck({
    id: id,
    name: req.body.name,
    image: req.body.image,
    info: req.body.info,
    gcw: req.body.gcw,
    long: req.body.long,
    high: req.body.high,
    wide: req.body.wide,
    capacity: req.body.capacity,
    available: req.body.available,
  });
  console.log(truck);
  await truck.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// create api for fetching and editing trucks
router.post("/edittruck", authenticateToken, authorizeRole('admin'), async (req, res) => {
  const truckId = req.body.id;

  // Fetch the current truck details
  let truck = await Truck.findOne({ id: truckId });

  if (!truck) {
    return res.json({
      success: false,
      message: "Truck not found",
    });
  }

  // Update the truck details with the new values from the request body
  truck.name = req.body.name || truck.name;
  truck.image = req.body.image || truck.image;
  truck.info = req.body.info || truck.info;
  truck.gcw = req.body.gcw || truck.gcw;
  truck.long = req.body.long || truck.long;
  truck.high = req.body.high || truck.high;
  truck.wide = req.body.wide || truck.wide;
  truck.capacity = req.body.capacity || truck.capacity;
  truck.available = req.body.available !== undefined ? req.body.available : truck.available;

  // Save the updated truck
  await truck.save();

  console.log("Truck updated:", truck);
    // Respond with success and the updated truck details
    res.json({
      success: true,
      truck: truck,
    });
  });

  // create API to fetch a truck's details by its ID
router.get("/truck/:id", async (req, res) => {
  const truckId = req.params.id;
  const truck = await Truck.findOne({ id: truckId });
  if (!truck) {
    return res.json({ success: false, message: "Truck not found" });
  }
  res.json({ success: true, truck });
});

router.use("/images", express.static("upload/images"));

router.post("/upload", authenticateToken, authorizeRole('admin'), upload.single("truck"), (req, res) => {
  console.log("upload route req.file: ", req.file);
  console.log("File uploaded to:", req.file.path);


  try {
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // File has been uploaded successfully
    console.log("Uploaded file:", req.file);
    res.json({
      success: 1,
      image_url: `https://www.nimpression.site/upload/images/${req.file.filename}`,
    });
  } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "File upload failed" });
  }
});

module.exports = router;
