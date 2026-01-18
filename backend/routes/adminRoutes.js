const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, adminController.getAllAdmins);
router.get('/:id', authMiddleware, adminController.getAdminById);
router.post('/', authMiddleware, adminController.createAdmin);
router.put('/:id', authMiddleware, adminController.updateAdmin);
router.delete('/:id', authMiddleware, adminController.deleteAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/logout', authMiddleware, adminController.logoutAdmin);
router.post('/refresh-token', adminController.refreshToken);
router.post('/logged', adminController.verifyAdmin);

module.exports = router;
