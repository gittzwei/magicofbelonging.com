const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const storiesController = require('../controllers/stories');
const admin = require('../middlewares/admin');

// Add these routes
router.put('/:id', auth, storiesController.updateStory);
router.delete('/:id', auth, admin, storiesController.deleteStory);
router.get('/admin/pending', auth, admin, storiesController.getPendingStories);

// @route   GET api/stories
// @desc    Get all stories
// @access  Public
router.get('/', storiesController.getStories);

// @route   GET api/stories/:id
// @desc    Get single story
// @access  Public
router.get('/:id', storiesController.getStory);

// @route   POST api/stories
// @desc    Create story
// @access  Private
router.post('/', auth, storiesController.createStory);
router.get('/search', storiesController.searchStories);

module.exports = router;