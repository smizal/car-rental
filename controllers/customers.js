const { response } = require('express')
const Category = require('../models/category.js')
const Info = require('../models/info.js')
const User = require('../models/user.js')
const Car = require('../models/car.js')
const Customer = require('../models/customer.js')
const Booking = require('../models/booking.js')

const index = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCategories = await Category.find({ status: 'active' })
    const allCars = await Car.find({ status: 'active' })
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(4)
    res.render('front/index.ejs', { siteInfo, allCars, allCategories })
  } catch (error) {
    res.render('error.ejs')
  }
}

const cars = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCars = await Car.find({ status: 'active' })
      .populate('category')
      .sort({ createdAt: -1 })
    res.render('front/cars.ejs', { siteInfo, allCars })
  } catch (error) {
    res.render('error.ejs')
  }
}

const request = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const car = await Car.findById(req.params.carId)
    console.log('car: ', car)
    res.render('front/request.ejs', { siteInfo, car })
  } catch (error) {
    res.render('error.ejs')
  }
}

const postRequest = async (req, res) => {
  try {
    req.body.status = 'active'
    req.body.car = req.params.carId
    req.body.password = '123456'
    // First, get the user from the database
    const customer = await Customer.findOne({
      cpr: req.body.cpr
    })

    // Check if there is existing user with same username !
    if (customer) {
      req.body.customer = customer._id
    } else {
      customer = await Customer.create(req.body)
      req.body.customer = customer._id
    }

    // Save the user data in database
    req.body.status = 'new'
    const booking = await Booking.create(req.body)
    res.redirect('/')
  } catch (error) {
    res.render('error.ejs')
  }
}

module.exports = {
  index,
  cars,
  request,
  postRequest
}
