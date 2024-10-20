const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const apiKey = fs.readFileSync('/run/secrets/GOOGLE_MAPS_API_KEY', 'utf8').trim();
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

const calculateDeliveryFee = (weight, length, width, height, duration) => {
};

router.post('/addbooking', authenticateToken, authorizeRole('customer', 'admin'), async (req, res) => {
  console.log("Request body_route_addbooking:", req.body);
  const { 
    origin, destination, category, length, width, height, weight, value, 
    sendingDate, senderName, senderCompany, senderReference, senderEmail, senderPhone, 
    receiverName, receiverEmail, receiverPhone, receiverCompany, duration, status
  } = req.body;

  // Log the received duration
  console.log("Received duration:", duration);

  // Backend validation
  if (!origin || !destination || !category || !length || !width || !height || !weight || !value || 
    !sendingDate || !senderName || !senderEmail || !senderPhone || !receiverName || !receiverEmail || !receiverPhone) {
    return res.status(400).json({ success: false, message: "Please fill out all required fields." });
  }

  if (!duration) {
    return res.status(400).json({ success: false, message: "Duration is required." });
  }

  // Calculate delivery fee
  const { chargeableWeight, deliveryFee } = calculateDeliveryFee(weight, length, width, height, duration);

  if (!deliveryFee) {
    return res.status(400).json({ success: false, message: "Delivery fee is required." });
  }

  // Access the user ID from the token payload
  const userId = req.user.id;
  console.log("User ID from token:", req.user.id);

  if (!userId) {
    return res.status(401).json({ success: false, message: "User not found." });
  }

  try {
    let bookings = await Booking.find({});
    let id = bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1;

    // Create a new booking with the userId from the token
    const newBooking = new Booking({
      id,
      userId, 
      origin,
      destination,
      category,
      length,
      width,
      height,
      weight,
      value,
      sendingDate,
      senderName,
      senderEmail,
      senderPhone,
      senderCompany,
      senderReference,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverCompany,
      duration: Number(duration) || null,
      chargeableWeight, 
      deliveryFee, 
      status,
    });

    await newBooking.save();

    res.status(201).json({ success: true, message: "Booking added successfully!", booking: newBooking });
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).json({ success: false, message: "Error adding booking.", error });
  }
});

// Creating api for getting all booking
router.get("/allbookings", authenticateToken, authorizeRole('admin'), async (req, res) => {
  let bookings = await Booking.find({});
  console.log("All bookings Fetched");
  res.send(bookings);
});

// creating api for removing bookings
router.post('/removebooking', async(req, res) => {
  await Booking.findOneAndDelete({id: req.body.id});
  console.log("Booking Deleted");
  res.json({
    success: true,
    message: "The booking is deleted successfully",
    name: req.body.name,
  })
});

// create api for fetching and editing bookings
router.post("/editbooking", async (req, res) => {
  const bookingId = req.body.id;

  // Fetch the current booking details
  let booking = await Booking.findOne({ id: bookingId });

  if (!booking) {
    return res.json({
      success: false,
      message: "Booking not found",
    });
  }

  // Update the booking details with the new values from the request body
  booking.origin = req.body.origin || booking.origin;
  booking.destination = req.body.destination || booking.destination;
  booking.category = req.body.category || booking.category;
  booking.length = req.body.length || booking.length;
  booking.width = req.body.width || booking.width;
  booking.height = req.body.height || booking.height;
  booking.weight = req.body.weight || booking.weight;
  booking.value = req.body.value || booking.value;
  booking.sendingDate = req.body.sendingDate || booking.sendingDate;
  booking.senderName = req.body.senderName || booking.senderName;
  booking.senderCompany = req.body.senderCompany || booking.senderCompany || '';
  booking.senderEmail = req.body.senderEmail || booking.senderEmail;
  booking.senderPhone = req.body.senderPhone || booking.senderPhone;
  booking.senderReference = req.body.senderReference || booking.senderReference || '';
  booking.receiverName = req.body.receiverName || booking.receiverName;
  booking.receiverCompany = req.body.receiverCompany || booking.receiverCompany || '';
  booking.receiverEmail = req.body.receiverEmail || booking.receiverEmail;
  booking.receiverPhone = req.body.receiverPhone || booking.receiverPhone;
  booking.status = req.body.status || booking.status;
  booking.duration = req.body.duration || booking.duration; 

  // Check if any of the key fields that affect deliveryFee have been changed
  const fieldsThatAffectFee = ['length', 'width', 'height', 'weight', 'origin', 'destination', 'duration'];
  const hasKeyFieldChanged = fieldsThatAffectFee.some(field => req.body[field] !== undefined);

  // Log whether key fields have changed
  console.log("Has key field changed?", hasKeyFieldChanged);

  // Recalculate delivery fee and chargeable weight if any key field has been changed
  if (hasKeyFieldChanged) {
    const { chargeableWeight, deliveryFee } = calculateDeliveryFee(
      booking.weight,
      booking.length,
      booking.width,
      booking.height,
      booking.duration
    );

    // Log the new calculated values
    console.log("New chargeableWeight:", chargeableWeight);
    console.log("New deliveryFee:", deliveryFee);

    // Update the booking with new chargeable weight and delivery fee
    booking.chargeableWeight = chargeableWeight;
    booking.deliveryFee = deliveryFee;
  }

  try {
    // Save the updated booking
    await booking.save();

    console.log("Booking updated:", booking);

    // Respond with success and the updated booking details
    res.json({
      success: true,
      booking: booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, message: "Error updating booking.", error });
  }
});



// to fetch a single booking
  router.get('/user/:userId', authenticateToken, authorizeRole('customer', 'admin'), async (req, res) => {
    try {
      const userId = req.params.userId;
      const bookings = await Booking.find({ userId });
      
      if (!bookings) {
        return res.status(404).json({ message: 'No bookings found' });
      }
  
      res.json(bookings); // Ensure you're returning JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.post('/get-distance', async (req, res) => {
    const { origin, destination } = req.body;
  
    console.log('route get-distance: Origin:', origin);
    console.log('route get-distance: Destination:', destination);
  
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }
  
    const matrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  
    try {
      const matrixResponse = await fetch(matrixUrl);
      const matrixData = await matrixResponse.json();
      console.log('Matrix Response Data:', matrixData); // Log the complete response data
  
      if (!matrixResponse.ok || !matrixData.rows || !matrixData.rows[0].elements[0].duration) {
        return res.status(400).json({ error: 'Could not calculate distance or duration' });
      }
  
      const duration = matrixData.rows[0].elements[0].duration.value; // Duration in seconds
  
      res.json({ success: true, duration });
    } catch (error) {
      console.error('Error fetching distance matrix:', error);
      res.status(500).json({ error: 'Failed to calculate distance' });
    }
  });
  

router.get('/payment-summary', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const paymentReceived = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['Pending', 'Wait for payment'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$deliveryFee' },
          thisWeek: {
            $sum: {
              $cond: [{ $gte: ['$sendingDate', startOfWeek] }, '$deliveryFee', 0]
            }
          },
          thisMonth: {
            $sum: {
              $cond: [{ $gte: ['$sendingDate', startOfMonth] }, '$deliveryFee', 0]
            }
          }
        }
      }
    ]);

    const paymentWaiting = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['Pending', 'Wait for payment'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$deliveryFee' },
          thisWeek: {
            $sum: {
              $cond: [{ $gte: ['$sendingDate', startOfWeek] }, '$deliveryFee', 0]
            }
          },
          thisMonth: {
            $sum: {
              $cond: [{ $gte: ['$sendingDate', startOfMonth] }, '$deliveryFee', 0]
            }
          }
        }
      }
    ]);

    res.json({
      paymentReceived: paymentReceived[0] || { total: 0, thisWeek: 0, thisMonth: 0 },
      paymentWaiting: paymentWaiting[0] || { total: 0, thisWeek: 0, thisMonth: 0 }
    });
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ message: error.message });
  }
});
  

module.exports = router;
