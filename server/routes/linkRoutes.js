const express = require('express');
const router = express.Router();
const { getLinks, createLink, deleteLink, getProjects } = require('../controllers/linkController');
const { protect } = require('../middleware/authMiddleware');

// Protect all these routes
router.use(protect);

router.route('/').get(getLinks).post(createLink);
router.route('/projects').get(getProjects);
router.route('/:id').delete(deleteLink);

module.exports = router;