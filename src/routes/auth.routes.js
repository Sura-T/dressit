const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation.middleware');

const router = express.Router();

// Registration validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('nickname').trim().notEmpty().withMessage('Nickname is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['man', 'woman']).withMessage('Invalid role'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('birthday').isISO8601().withMessage('Invalid birthday format'),
  body('interested_in_genders').isArray().withMessage('Interested in genders must be an array'),
  body('interested_in_roles').isArray().withMessage('Interested in roles must be an array')
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/me', authController.getMe);

module.exports = router; 