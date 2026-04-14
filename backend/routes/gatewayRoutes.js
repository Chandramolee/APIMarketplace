const express = require('express');
const router = express.Router();
const { handleGatewayRequest } = require('../controllers/gatewayController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// The main gateway endpoint
// Example usage: POST /api/gateway/60d... with 'x-api-key' header
router.post('/:apiId', apiKeyAuth, handleGatewayRequest);
router.get('/:apiId', apiKeyAuth, handleGatewayRequest);

module.exports = router;
