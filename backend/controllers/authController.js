import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      taxRegime: user.taxRegime,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include passwordHash
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      taxRegime: user.taxRegime,
      pan: user.pan,
      phoneNumber: user.phoneNumber,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    taxRegime: user.taxRegime,
    pan: user.pan,
    phoneNumber: user.phoneNumber,
  });
});
