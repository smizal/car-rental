const mongoose = require('mongoose')

const infoSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    adminUpdated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
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

const Info = mongoose.model('Info', infoSchema)

module.exports = Info
