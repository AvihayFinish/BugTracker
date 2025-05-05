import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /users/register
// @access  Public
const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const newUser = await User.create({
    name,
    email,
    password,
  });

  // Check if user was created successfully
  if (newUser) {
    generateToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login a user
// @route   POST /users/login
// @access  Public
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if user exists and password is correct
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout a user
// @route   POST /users/logout
// @access  Public
const userLogout = asyncHandler(async (req, res) => {

  // Clear the cookie by setting it to an empty string and setting the expiration date to the past
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
  }).json({
    message: "Logged out successfully",
  });
});

// @desc    Get user profile
// @route   GET /users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  // Check if user is authenticated, this is done in the protect middleware
  // The user information is already attached to req.user by the middleware
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  }
  else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// @desc    Update user profile
// @route   PUT /users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  }
  else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { userRegister, 
        userLogin, 
        userLogout, 
        getProfile, 
        updateProfile };