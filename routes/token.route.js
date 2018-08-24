const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/token.controller');

router.get('/get-support-tokens', tokenController.handleGetSupportTokens);

module.exports = router;