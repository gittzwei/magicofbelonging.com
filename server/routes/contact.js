const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const contactController = require('../controllers/contact');

// @route   POST api/contact
// @desc    Send contact message
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('message', 'Message is required').not().isEmpty()
  ],
  contactController.sendContactMessage
);

module.exports = router;