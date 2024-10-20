const express = require('express');
const router = express.Router();
const Email = require('../models/Newsletter');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// const jwt_secret = process.env.JWT_SECRET;
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

  
// API endpoint to handle email subscription
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if the email already exists
        const existingEmail = await Email.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ error: 'This email is already subscribed.' }); // Conflict status
        }
        
        const newEmail = new Email({ email });
        await newEmail.save();
        res.status(201).json({ message: 'Subscription successful! You will receive our latest news and updates via email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while subscribing' });
    }
  });

// Creating api for getting all subscription email
router.get("/subscription/list", authenticateToken, authorizeRole('admin'), async (req, res) => {
    let emails = await Email.find({});
    console.log("All Emails Fetched: ", emails);
    res.send(emails);
  });

// creating api for removing emails
router.post('/subscription/remove', async(req, res) => {
  await Email.findOneAndDelete({id: req.body.id});
  console.log("Email Deleted");
  res.json({
    success: true,
    message: "The email is deleted successfully",
    name: req.body.name,
  })
});
  
  
module.exports = router;
