const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
      required: true
    },
    returnDate: {
      type: String,
      required: true
    },
    startReport: {
      type: String,
      required: false
    },
    endReport: {
      type: String,
      required: false
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: false
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    adminAdded: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    adminUpdated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    status: {
      type: String,
      enum: ['new', 'accepted', 'rejected', 'returned', 'deleted'],
      required: true
    },
    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking
