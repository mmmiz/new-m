const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//GET a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    // console.error(err);
    res.status(500).json(err);
  }
});



//update user
router.put("/:id", async (req, res) => {
  try {
      const existingUser = await User.findOne({
          $or: [
              { username: req.body.username },
              { email: req.body.email }
          ],
          _id: { $ne: req.params.id } // Exclude the current user from the check
      });
      if (existingUser) {
          return res.status(400).json({ error: 'Username or email is already in use.' });
      }
      const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
      });
      res.status(200).json("Account has been updated");
      // console.log(user);
  } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;