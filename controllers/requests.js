const { response } = require('express')
const Category = require('../models/category.js')
const Info = require('../models/info.js')
const User = require('../models/user.js')
const Car = require('../models/car.js')
const Booking = require('../models/booking.js')
const fs = require('fs')

const index = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allRequests = await Booking.find({})
      .populate('customer')
      .populate('car')
    res.render('admin/requests/index.ejs', { siteInfo, allRequests })
  } catch (error) {
    res.render('error.ejs')
  }
}

const status = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.requestId, {
      status: req.params.state,
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/requests`)
  } catch (error) {
    res.render('error.ejs')
  }
}

module.exports = {
  index,
  status
}
