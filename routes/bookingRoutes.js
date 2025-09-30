const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');  

router.post('/bookings', bookingController.createBooking);

router.get('/bookings', bookingController.getAllBookings);

router.get('/bookingsByDate', bookingController.getBookingsByDate);

router.delete('/bookings/:bookingId', bookingController.cancelBooking);

module.exports = router;
