const User = require('../models/userModel');    
const Room = require('../models/roomModel');    
const Booking = require('../models/bookingModel');

const { validateCreateBooking, validateSearchBookings } = require('../validations/bookingValidation');

exports.createBooking = async (req, res) => {
  try {
    const errors = validateCreateBooking(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', details: errors });
    }

    const { customerId, roomId, checkInDate, checkOutDate } = req.body;

    const overlappingBooking = await Booking.findOne({
      roomId,
      status: { $ne: 'cancelled' },
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) }
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Phòng đã được đặt trong khoảng thời gian này' });
    }

    const booking = new Booking({ customerId, roomId, checkInDate, checkOutDate });
    await booking.save();

    res.status(201).json({ message: 'Đặt phòng thành công', booking });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    }

    if (new Date() >= booking.checkInDate) {
      return res.status(400).json({ message: 'Không thể hủy vì đã đến ngày nhận phòng' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Hủy đặt phòng thành công', booking });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const bookings = await Booking.find()
      .populate('customerId', 'username email')
      .populate('roomId', 'roomNumber type price')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Không có đơn đặt phòng nào' });
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getBookingsByDate = async (req, res) => {
  try {
    const errors = validateSearchBookings(req.query);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', details: errors });
    }

    const { startDate, endDate } = req.query;

    const bookings = await Booking.find({
      checkInDate: { $gte: new Date(startDate) },
      checkOutDate: { $lte: new Date(endDate) }
    })
      .populate('customerId', 'name email')
      .populate('roomId', 'roomNumber type price');

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Không có đặt phòng nào trong khoảng thời gian này' });
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
