const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const contactController = require('../controllers/contact');

// @route   GET api/contact/test
// @desc    Test contact route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Contact route working!' }));

// @route   POST api/contact
// @desc    Send contact message
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('message', 'Message must be 10+ characters').isLength({ min: 10 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  contactController.sendContactMessage
);

module.exports = router;