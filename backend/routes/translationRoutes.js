const express = require('express');
const translationController = require('../controllers/translationController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, translationController.translateText);

module.exports = router;
