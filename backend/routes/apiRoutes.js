const express = require('express');
const router = express.Router();
const { getApis, getApiById, createApi } = require('../controllers/apiController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getApis).post(protect, createApi);
router.route('/:id').get(getApiById);

module.exports = router;
