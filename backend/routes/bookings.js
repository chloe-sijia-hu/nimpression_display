const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }
    req.user = user; // Attach the user to the request object
    console.log("user: ", req.user);
    next();
  });
};


router.post('/addbooking', authenticateToken, async (req, res) => {
  const { 
    origin, destination, category, length, width, height, weight, value, sendingDate, senderName, senderCompany, senderReference, senderEmail, senderPhone, receiverName, receiverEmail, receiverPhone, receiverCompany
  } = req.body;

  // Access the user ID from the token payload
  const userId = req.user.id;
  console.log("User ID from token:", req.user.id);


  if (!userId) {
    return res.status(401).json({ success: false, message: "User not found." });
  }

  // Backend validation
  if (!origin || !destination || !category || !length || !width || !height || !weight || !value || !sendingDate || !senderName || !senderEmail || !senderPhone || !receiverName || !receiverEmail || !receiverPhone) {
    return res.status(400).json({ success: false, message: "Please fill out all required fields." });
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
    });

    await newBooking.save();

    res.status(201).json({ success: true, message: "Booking added successfully!", booking: newBooking });
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).json({ success: false, message: "Error adding booking.", error });
  }
});





// Creating api for getting all booking
router.get("/allbookings", async (req, res) => {
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
// create api for fetching and editing trucks
router.post("/editbooking", async (req, res) => {
  const bookingId = req.body.id;

  // Fetch the current truck details
  let booking = await Booking.findOne({ id: bookingId });

  if (!booking) {
    return res.json({
      success: false,
      message: "Booking not found",
    });
  }

  // Update the booking details with the new values from the request body
  booking.origin = req.body.origin;
  booking.destination = req.body.destination;
  booking.category = req.body.category;
  booking.length = req.body.length;
  booking.width = req.body.width;
  booking.height = req.body.height;
  booking.weight = req.body.weight;
  booking.value = req.body.value;
  booking.sendingDate = req.body.sendingDate;
  booking.senderName = req.body.senderName;
  booking.senderCompany = req.body.senderCompany || '';
  booking.senderEmail = req.body.senderEmail;
  booking.senderPhone = req.body.senderPhone;
  booking.senderReference = req.body.senderReference || '';
  booking.receiverName = req.body.receiverName;
  booking.receiverCompany = req.body.receiverCompany || '';
  booking.receiverEmail = req.body.receiverEmail;
  booking.receiverPhone = req.body.receiverPhone;
  
  // Save the updated booking
  await booking.save();

  console.log("Booking updated:", booking);
    // Respond with success and the updated booking details
    res.json({
      success: true,
      booking: booking,
    });
  });

  // router.get('/user/:userId', async (req, res) => {
  //   try {
  //     const userId = req.params.userId;
  //     const userBookings = await Booking.find({ userId });
  //     res.status(200).json(userBookings);
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error fetching user bookings', error });
  //   }
  // });

  router.get('/user/:userId', authenticateToken, async (req, res) => {
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
  

module.exports = router;
