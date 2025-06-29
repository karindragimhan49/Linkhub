const express = require('express');
const router = express.Router();
const { getLinks, addLink, updateLink, deleteLink } = require('../controllers/linkController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all link routes
router.use(authMiddleware);

router.route('/').get(getLinks).post(addLink);
router.route('/:id').put(updateLink).delete(deleteLink);

module.exports = router;