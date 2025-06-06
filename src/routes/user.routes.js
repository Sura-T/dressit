const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const User = require('../models/user.model');

const router = express.Router();

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Get user profile by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -is_deleted')
      .lean();

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching user profile',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nickname:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *               interested_in_genders:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [male, female, other]
 *               interested_in_roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [man, woman]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Update user profile
router.patch('/me', auth, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('nickname').optional().trim().notEmpty().withMessage('Nickname cannot be empty'),
  body('bio').optional().trim(),
  body('location').optional().trim(),
  body('avatar_url').optional().trim(),
  body('interested_in_genders').optional().isArray().withMessage('Must be an array'),
  body('interested_in_roles').optional().isArray().withMessage('Must be an array')
], validateRequest, async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'nickname',
      'bio',
      'location',
      'avatar_url',
      'interested_in_genders',
      'interested_in_roles'
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -is_deleted');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating profile',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete current user's account (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Soft delete user account
router.delete('/me', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { is_deleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting account',
      details: error.message
    });
  }
});

module.exports = router; 