const express = require('express');
const router = express.Router();
const { addReview, getReviewsForApi, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
router.route('/api/:apiId').get(getReviewsForApi);

module.exports = router;
