const express = require('express');
const airlineController = require('../controllers/airlineController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/all', authMiddleware, airlineController.getAllAirlines);
router.get('/', authMiddleware, airlineController.getAirlines);
router.get('/:id', authMiddleware, airlineController.getAirlineById);
router.post('/', authMiddleware, airlineController.createAirline);
router.put('/:id', authMiddleware, airlineController.updateAirline);
router.delete('/:id', authMiddleware, airlineController.deleteAirline);

module.exports = router;
