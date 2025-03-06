import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Generate JWT and store in cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

// Register User
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    company,
  });

  if (user) {
    const token = generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token,
    });
  } else {
    return res.status(400).json({ success: false, message: 'Failed to create user' });
  }
});

// Login User
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    const token = generateTokenAndSetCookie(res, user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token,
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Logout User (Clear Cookie)
export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.json({ success: true, message: 'User logged out successfully' });
});

// Get User Profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    return res.json({
      success: true,
      message: 'Profile fetched successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        location: user.location,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
      },
    });
  } else {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
});
