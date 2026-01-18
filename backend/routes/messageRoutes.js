const express = require('express');
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, messageController.sendMessage);

module.exports = router;
