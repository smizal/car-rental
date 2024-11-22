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
      required: true
    },
    endReport: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    adminAdded: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    adminUpdated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'returned', 'deleted'],
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
