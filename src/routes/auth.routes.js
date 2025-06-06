const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation.middleware');
const auth = require('../middlewares/auth.middleware');

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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - nickname
 *         - email
 *         - password
 *         - role
 *         - gender
 *         - birthday
 *         - interested_in_genders
 *         - interested_in_roles
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         nickname:
 *           type: string
 *           description: User's unique nickname
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password
 *         role:
 *           type: string
 *           enum: [man, woman]
 *           description: User's role in the app
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: User's gender
 *         birthday:
 *           type: string
 *           format: date
 *           description: User's birthday
 *         avatar_url:
 *           type: string
 *           description: URL to user's avatar image
 *         bio:
 *           type: string
 *           description: User's biography
 *         location:
 *           type: string
 *           description: User's location
 *         interested_in_genders:
 *           type: array
 *           items:
 *             type: string
 *             enum: [male, female, other]
 *           description: Genders the user is interested in
 *         interested_in_roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [man, woman]
 *           description: Roles the user is interested in
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: object
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerValidation, validateRequest, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginValidation, validateRequest, authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', auth, authController.getMe);

module.exports = router; 