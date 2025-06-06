const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  try {
    const {
      name,
      nickname,
      email,
      password,
      role,
      avatar_url,
      bio,
      location,
      birthday,
      gender,
      interested_in_genders,
      interested_in_roles
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { nickname }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email or nickname'
      });
    }

    // Create new user
    const user = new User({
      name,
      nickname,
      email,
      password,
      role,
      avatar_url,
      bio,
      location,
      birthday,
      gender,
      interested_in_genders,
      interested_in_roles
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        birthday: user.birthday,
        gender: user.gender,
        is_verified: user.is_verified,
        interested_in_genders: user.interested_in_genders,
        interested_in_roles: user.interested_in_roles
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error registering user',
      details: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, is_deleted: false });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last active
    await user.updateLastActive();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        birthday: user.birthday,
        gender: user.gender,
        is_verified: user.is_verified,
        interested_in_genders: user.interested_in_genders,
        interested_in_roles: user.interested_in_roles
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error logging in',
      details: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        birthday: user.birthday,
        gender: user.gender,
        is_verified: user.is_verified,
        interested_in_genders: user.interested_in_genders,
        interested_in_roles: user.interested_in_roles,
        created_at: user.created_at,
        last_active_at: user.last_active_at
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching user profile',
      details: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
}; 