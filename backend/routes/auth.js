const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;


    // Check required fields

    if (!name || !email || !password) {

      return res.status(400).json({
        message: "Please fill all fields"
      });

    }


    // Check existing user

    const existingUser = await User.findOne({
      email
    });


    if (existingUser) {

      return res.status(400).json({
        message: "Email already registered"
      });

    }


    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // Create user

    const user = await User.create({

      name,

      email,

      password: hashedPassword

    });


    res.status(201).json({

      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;


    // Check fields

    if (!email || !password) {

      return res.status(400).json({
        message: "Please enter email and password"
      });

    }


    // Find user

    const user = await User.findOne({
      email
    });


    if (!user) {

      return res.status(401).json({
        message: "Invalid email or password"
      });

    }


    // Compare password

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!passwordMatch) {

      return res.status(401).json({
        message: "Invalid email or password"
      });

    }


    // Create JWT

    const token = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );


    res.status(200).json({

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;
