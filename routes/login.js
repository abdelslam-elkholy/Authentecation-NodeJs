const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

router.post('/', async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    // check if user already exist
    // Validate for the matching password
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token for user
      const token = jwt.sign(
        {
          id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );
      // save token to user
      user.token = token;

      // return user data
      res.status(200).send(`Welcome ${user.firstName}`);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ token: req.headers.authorization });
    if (user) {
      res.status(200).send(`Welcome ${user.firstName}`);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
