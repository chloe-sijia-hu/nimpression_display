const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds
const Booking = require('../models/Booking');
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
    console.log("Authenticated user: ", req.user);
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

// Get all users (for admin)
router.get('/allusers', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete a user
router.post('/removeuser', authenticateToken, authorizeRole('admin'), async(req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    console.log("User deleted");
    res.json({
      success: true,
      email: req.body.email,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a user
router.post('/updateuser', authenticateToken, authorizeRole('admin'), async(req, res) => {
  try {
    const { id, email, role, password } = req.body;
    console.log('Updating user:', { id, email, role, password: password ? '[REDACTED]' : undefined });

    const updateData = { email, role };
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password' });
    
    if (!updatedUser) {
      console.log('User not found:', id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Get all users (for admin)
router.get('/allusers', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update user (for admin)
router.put('/:userId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { email, role, password } = req.body;
    const userId = req.params.userId;

    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, select: '-password' });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Delete user (for admin)
router.delete('/:userId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});


router.get('/me', authenticateToken, authorizeRole('customer', 'admin'), async (req, res) => {
  // Check if req.user is defined before accessing it
  if (!req.user) {
      return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
      const user = await User.findById(req.user.id); // Accessing req.user.id only if req.user is verified
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ id: user._id, role: user.role, ...user._doc });
      console.log('User from token:', req.user);
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/signup', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    let check = await User.findOne({ email });
    if (check) return res.status(400).json({ success: false, errors: 'Existing user found with same email address' });
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // const cart = {};
    // for (let i = 0; i < 300; i++) cart[i] = 0;

    // Set role to 'customer' by default 
    const role = req.body.role || 'customer';

    const user = new User({
      name: req.body.username, 
      email, // Store the email in lowercase
      password: hashedPassword, // Save the hashed password
      // role: "customer"
      role: role
    });
    await user.save();

    const data = { id: user.id, role: user.role };
    const token = jwt.sign(data, jwt_secret, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// creating endpoint for user login
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });

    console.log('Login request body:', req.body);


    if (!user) return res.status(400).json({ success: false, errors: 'Wrong Email address' });

    // Compare the provided password with the hashed password
    const passMatch = await bcrypt.compare(req.body.password, user.password);
    if (passMatch) {
      const data = { id: user.id, role: user.role };
      const token = jwt.sign(data, jwt_secret, { expiresIn: '1h' });

      console.log('data from backend: ', data)
      console.log('JWT Secret: ', jwt_secret);
      // Fetch user's bookings
      const bookings = await Booking.find({ userId: user.id });
      
      const waitingForPayment = bookings.filter(booking => booking.status === 'Wait for payment');
      const delivered = bookings.filter(booking => booking.status === 'Delivered');

      res.json({ 
        success: true, 
        token,
        alerts: {
          waitingForPayment: waitingForPayment.map(booking => ({
            id: booking.id,
            category: booking.category
          })),
          delivered: delivered.map(booking => ({
            id: booking.id,
            category: booking.category
          }))
        }
      });
    } else {
      res.json({ success: false, errors: 'Wrong Password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

router.get('/logout', authenticateToken, authorizeRole('customer', 'admin'), async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});
  


router.get('/admin/dashboard', authenticateToken, authorizeRole('admin'), async (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
}
);


module.exports = router;
