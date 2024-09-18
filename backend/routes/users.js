const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds

// Middleware to fetch user
// const fetchUser = async (req, res, next) => {
//   const token = req.header('auth-token');
//   if (!token) return res.status(401).send({ errors: 'Please authenticate using valid login' });
//   try {
//     const data = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ errors: 'please authenticate using a valid token' });
//   }
// };



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


router.get('/me', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id); // Assuming req.user contains the authenticated user's ID
      res.json(user);
  } catch (error) {
      res.status(500).send('Server error');
  }
});

router.post('/signup', async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) return res.status(400).json({ success: false, errors: 'Existing user found with same email address' });
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new User({
      name: req.body.username, 
      email: req.body.email, 
      password: hashedPassword, // Save the hashed password
      cartData: cart,
    });
    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// creating endpoint for user login
  router.post('/login', async (req, res) => {
    try {
      console.log('Email from request:', req.body.email); // Log the email from request
  
      const user = await User.findOne({ email: req.body.email });
      console.log('User found:', user); // Log the user object found
  
      if (!user) return res.status(400).json({ success: false, errors: 'Wrong Email address' });
  
      // Compare the provided password with the hashed password
      const passMatch = await bcrypt.compare(req.body.password, user.password);
      if (passMatch) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
      } else {
        res.json({ success: false, errors: 'Wrong Password' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error });
    }
  });
  

// creating endpoint for adding products in cartdata
router.post("/addtocart", authenticateToken, async (req, res) => {
  console.log("Added", req.body.itemId)
let userData = await User.findOne({ _id: req.user.id });
userData.cartData[req.body.itemId] += 1;
await User.findOneAndUpdate({ _id: req.user.id },{ cartData: userData.cartData });
res.send("Added");
});

// creating endpoint for removing cartData
router.post("/removefromcart", authenticateToken, async (req, res) => {
  console.log("Removed", req.body.itemId)
let userData = await User.findOne({ _id: req.user.id });
if (userData.cartData[req.body.itemId] > 0)
  userData.cartData[req.body.itemId] -= 1;
  await User.findOneAndUpdate({ _id: req.user.id },{ cartData: userData.cartData }
);
res.send("Removed");
});

// creating endpoint to get cart data

router.post('/getcart', authenticateToken, async(req, res)=> {
  console.log('Get cart');
  let userData = await User.findOne({_id: req.user.id});
  res.json(userData.cartData);
})



  

module.exports = router;
