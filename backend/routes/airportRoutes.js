const express = require('express');
const airportController = require('../controllers/airportController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/all', authMiddleware, airportController.getAllAirports);
router.get('/', authMiddleware, airportController.getAirports);
router.get('/:id', authMiddleware, airportController.getAirportById);
router.post('/', authMiddleware, airportController.createAirport);
router.put('/:id', authMiddleware, airportController.updateAirport);
router.delete('/:id', authMiddleware, airportController.deleteAirport);

module.exports = router;
