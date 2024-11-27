const { response } = require('express')
const Category = require('../models/category.js')
const Info = require('../models/info.js')
const User = require('../models/user.js')
const Car = require('../models/car.js')
const Customer = require('../models/customer.js')

const index = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCars = await Car.find({ status: 'active' })
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(8)
    res.render('front/index.ejs', { siteInfo, allCars })
  } catch (error) {
    return res.send(error)
  }
}

module.exports = {
  index
}
