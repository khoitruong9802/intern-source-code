const express = require('express');
const flightController = require('../controllers/flightController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, flightController.getFlights);
router.get('/:id', authMiddleware, flightController.getFlightById);
router.post('/', authMiddleware, flightController.createFlight);
router.put('/:id', authMiddleware, flightController.updateFlight);
router.delete('/:id', authMiddleware, flightController.deleteFlight);

module.exports = router;
