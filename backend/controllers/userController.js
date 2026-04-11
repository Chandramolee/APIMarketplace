const User = require('../models/User');
const Api = require('../models/Api');
const Review = require('../models/Review');
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');

const toggleBookmark = async (req, res) => {
  try {
    const { apiId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isBookmarked = user.bookmarks.includes(apiId);
    
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== apiId);
    } else {
      user.bookmarks.push(apiId);
    }
    
    await user.save();
    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateKey = async (req, res) => {
  try {
    const { apiId } = req.params;
    
    // Check if user already has active key for this API
    const existingKey = await ApiKey.findOne({ user: req.user._id, api: apiId, isActive: true });
    
    if (existingKey) {
      return res.status(400).json({ message: 'You already have an active key for this API', success: false });
    }
    
    const token = crypto.randomBytes(32).toString('hex');
    
    const apiKey = new ApiKey({
      user: req.user._id,
      api: apiId,
      key: token,
      isActive: true
    });
    
    await apiKey.save();
    res.status(201).json({ success: true, key: apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

const revokeKey = async (req, res) => {
    try {
      const { keyId } = req.params;
      const key = await ApiKey.findById(keyId);
      
      if (!key) return res.status(404).json({ message: 'Key not found', success: false });
      if (key.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized', success: false });
      
      key.isActive = false;
      await key.save();
      
      res.json({ success: true, message: 'Key revoked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', success: false });
    }
};

const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    const reviews = await Review.find({ user: req.user._id }).populate('api', 'name');
    const keys = await ApiKey.find({ user: req.user._id }).populate('api', 'name');
    
    res.json({
      success: true,
      data: {
        bookmarks: user.bookmarks,
        reviews,
        keys
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = { toggleBookmark, generateKey, getDashboardStats, revokeKey };
