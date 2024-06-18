const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userRef: {
      type: String,
      required: true
    },
    hostRef: {
      type: String,
      required: true
    },
    listingId: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema)
module.exports = Booking