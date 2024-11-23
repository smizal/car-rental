const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super', 'superadmin'],
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

const User = mongoose.model('User', userSchema)

module.exports = User
