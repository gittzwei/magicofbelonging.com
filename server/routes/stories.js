const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const storiesController = require('../controllers/stories');
const admin = require('../middlewares/admin');

// Specific routes first!
router.get('/search', storiesController.searchStories);
router.get('/admin/pending', auth, admin, storiesController.getPendingStories);

router.get('/', storiesController.getStories);
router.post('/', auth, storiesController.createStory);

// Now add the generic :id routes after
router.get('/:id', storiesController.getStory);
router.put('/:id', auth, storiesController.updateStory);
router.delete('/:id', auth, admin, storiesController.deleteStory);

// Add this export line (was missing)
module.exports = router;
