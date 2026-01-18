const express = require('express');
const settingController = require('../controllers/settingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// router.get('/all', authMiddleware, settingController.getAllSettings);
router.get('/', authMiddleware, settingController.getSettings);
// router.post('/', authMiddleware, settingController.createSetting);
router.put('/:id', authMiddleware, settingController.updateSetting);
router.delete('/:id', authMiddleware, settingController.deleteSetting);

module.exports = router;
