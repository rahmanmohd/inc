const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase, supabasePublic } = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').isIn(['admin', 'startup', 'investor', 'entrepreneur', 'mentor', 'user']),
  body('phone').optional().isMobilePhone(),
  body('company').optional().trim()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, handleValidationErrors, async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role = 'entrepreneur',
      phone,
      company
    } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'User with this email already exists'
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
          phone: phone,
          company: company
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return res.status(400).json({
        error: true,
        message: authError.message || 'Failed to create user'
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        error: true,
        message: 'Failed to create user account'
      });
    }

    // The profile will be automatically created by the trigger
    // But let's also create it manually to ensure it exists
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        company: company,
        role: role
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the request as the trigger should handle this
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        actor_user_id: authData.user.id,
        action: 'user_registered',
        target_table: 'profiles',
        target_id: authData.user.id,
        payload: { email, role }
      });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to confirm your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Auth login error:', authError);
      return res.status(401).json({
        error: true,
        message: authError.message || 'Invalid credentials'
      });
    }

    if (!authData.user) {
      return res.status(401).json({
        error: true,
        message: 'Invalid credentials'
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({
        error: true,
        message: 'Failed to fetch user profile'
      });
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        actor_user_id: authData.user.id,
        action: 'user_logged_in',
        target_table: 'profiles',
        target_id: authData.user.id,
        payload: { email }
      });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        company: profile.company
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error during login'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        actor_user_id: req.user.id,
        action: 'user_logged_out',
        target_table: 'profiles',
        target_id: req.user.id
      });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error during logout'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.profile.role,
        firstName: req.profile.first_name,
        lastName: req.profile.last_name,
        phone: req.profile.phone,
        company: req.profile.company,
        bio: req.profile.bio,
        createdAt: req.profile.created_at,
        updatedAt: req.profile.updated_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('company').optional().trim(),
  body('bio').optional().trim()
], handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, phone, company, bio } = req.body;

    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (phone) updateData.phone = phone;
    if (company) updateData.company = company;
    if (bio) updateData.bio = bio;

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(400).json({
        error: true,
        message: 'Failed to update profile'
      });
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        actor_user_id: req.user.id,
        action: 'profile_updated',
        target_table: 'profiles',
        target_id: req.user.id,
        payload: updateData
      });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        role: updatedProfile.role,
        firstName: updatedProfile.first_name,
        lastName: updatedProfile.last_name,
        phone: updatedProfile.phone,
        company: updatedProfile.company,
        bio: updatedProfile.bio,
        updatedAt: updatedProfile.updated_at
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        error: true,
        message: 'Refresh token is required'
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      console.error('Token refresh error:', error);
      return res.status(401).json({
        error: true,
        message: 'Invalid refresh token'
      });
    }

    res.json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
    });

    if (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({
        error: true,
        message: error.message || 'Failed to send reset email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
