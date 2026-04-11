const express = require('express');
const router = express.Router();
const { toggleBookmark, generateKey, getDashboardStats, revokeKey } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/bookmark/:apiId', protect, toggleBookmark);
router.post('/key/:apiId', protect, generateKey);
router.delete('/key/:keyId', protect, revokeKey);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
