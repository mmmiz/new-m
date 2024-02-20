require('dotenv').config();

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

//REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('this email address is already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  } 
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }
    const token = jwt.sign(
      { userId: user._id, 
        email: user.email, 
        username: user.username 
      }, 
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.cookie('accessToken', token, { httpOnly: true });
    res.status(200).json({ user, token });
    console.log('success');
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});


//LOGOUT
router.post("/logout", (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).json("Logout successful");
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;