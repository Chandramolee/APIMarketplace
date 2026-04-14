const Api = require('../models/Api');

/**
 * Handles the functional API request after key validation.
 * In a real-world scenario, this might proxy to another server.
 * For now, it returns the stored example response for the API.
 */
const handleGatewayRequest = async (req, res) => {
  try {
    const { apiId } = req.params;
    const api = await Api.findById(apiId);

    if (!api) {
      return res.status(404).json({ success: false, message: 'API definition not found.' });
    }

    const axios = require('axios');
    let responseData;

    // LIVE PROXY DEMO: Special handling for the Public Jokes API
    if (apiId === '69d659528b09629f22d4e05a') {
      try {
        const externalRes = await axios.get('https://official-joke-api.appspot.com/random_joke');
        responseData = externalRes.data;
      } catch (err) {
        console.error('External API Proxy Error:', err.message);
        responseData = { message: 'External API currently unavailable. Returning sample.', sample: JSON.parse(api.exampleResponse) };
      }
    } else {
      // Default: Prepare a mock response based on the API definition
      responseData = api.exampleResponse ? JSON.parse(api.exampleResponse) : { message: 'Success', status: 'authorized' };
    }

    res.json({
      success: true,
      info: {
        apiName: api.name,
        authorizedUser: req.apiUser.name,
        timestamp: new Date().toISOString()
      },
      data: responseData
    });

  } catch (error) {
    console.error('Gateway Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server error processing gateway request.' });
  }
};

module.exports = { handleGatewayRequest };
