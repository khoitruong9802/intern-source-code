const express = require('express');
const screenController = require('../controllers/screenController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/all', authMiddleware, screenController.getAllScreens);
router.get('/', authMiddleware, screenController.getScreens);
router.post('/', authMiddleware, screenController.createScreen);
router.post('/control', authMiddleware, screenController.controlScreen);
router.put('/:id', authMiddleware, screenController.updateScreen);
router.delete('/:id', authMiddleware, screenController.deleteScreen);

module.exports = router;
