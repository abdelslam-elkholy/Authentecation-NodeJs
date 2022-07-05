const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

router.post('/', async (req, res, next) => {
  try {
    // Get user input
    const { firstName, lastName, email, password } = req.body;
    // validate user input
    if (!(firstName && lastName && email && password)) {
      res.status(400).send('All input is required');
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(400).send('User already exist Please login');
    }

    // Encrypt password using bcrypt
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user and encrypt password before saving
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create token for user
    const token = jwt.sign(
      {
        id: newUser._id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );
    // save token to user
    newUser.token = token;
    // return user data
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
