const mongoose = require('mongoose')

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    seats: {
      type: String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
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
      enum: ['active', 'suspended', 'deleted'],
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

const Car = mongoose.model('Car', carSchema)

module.exports = Car
