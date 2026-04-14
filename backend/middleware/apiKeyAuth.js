const ApiKey = require('../models/ApiKey');

/**
 * Middleware to authenticate requests using a custom API Key.
 * Expects the key in the 'x-api-key' header.
 */
const apiKeyAuth = async (req, res, next) => {
  const keyStr = req.header('x-api-key');
  const { apiId } = req.params;

  if (!keyStr) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No API key provided in x-api-key header.' 
    });
  }

  try {
    const apiKey = await ApiKey.findOne({ key: keyStr, api: apiId, isActive: true })
      .populate('user', 'name email');

    if (!apiKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive API key for the requested resource.' 
      });
    }

    // Attach key and user info to request for the controller
    req.apiKey = apiKey;
    req.apiUser = apiKey.user;
    
    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

module.exports = apiKeyAuth;
