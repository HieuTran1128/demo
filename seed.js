const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/userModel');
const Room = require('./models/roomModel');
const Booking = require('./models/bookingModel');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function seedData() {
  try {
    const data = JSON.parse(fs.readFileSync('hotel.json', 'utf-8'));

    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();

    const users = await User.insertMany(data.users);
    console.log('Users seeded');

    const rooms = await Room.insertMany(data.rooms);
    console.log('Rooms seeded');

    const emailToId = {};
    users.forEach(u => { emailToId[u.email] = u._id; });

    const roomNumberToId = {};
    rooms.forEach(r => { roomNumberToId[r.roomNumber] = r._id; });

    const bookingsToInsert = data.bookings.map(b => ({
      customerId: emailToId[b.customerEmail],
      roomId: roomNumberToId[b.roomNumber],
      checkInDate: new Date(b.checkInDate),
      checkOutDate: new Date(b.checkOutDate),
      status: b.status || 'pending'
    }));

    await Booking.insertMany(bookingsToInsert);
    console.log('Bookings seeded');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
