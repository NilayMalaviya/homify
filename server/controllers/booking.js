const Booking = require("../models/booking");

const createBooking = async (req,res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
};
