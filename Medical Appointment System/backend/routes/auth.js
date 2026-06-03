const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Please provide a valid age'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Please provide a valid gender'),
  body('role').isIn(['patient', 'doctor']).withMessage('Please provide a valid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, age, gender, role, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      role,
      phone
    });

    // Create role-specific profile
    if (role === 'doctor') {
      await Doctor.create({ user: user._id });
    } else if (role === 'patient') {
      await Patient.create({ user: user._id });
    }

    // Create welcome notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to Medical Appointment System',
      message: 'Your account has been created successfully.',
      type: 'system'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
  console.error("REGISTER ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message
  });
  }
});
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let profileData = {};
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id }).populate('user', 'name email phone avatar');
      profileData = doctor;
    } else if (user.role === 'patient') {
      const patient = await Patient.findOne({ user: user._id }).populate('user', 'name email phone avatar');
      profileData = patient;
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        profile: profileData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
