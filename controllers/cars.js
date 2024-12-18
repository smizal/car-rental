const { response } = require('express')
const Category = require('../models/category.js')
const Info = require('../models/info.js')
const User = require('../models/user.js')
const Car = require('../models/car.js')
const fs = require('fs')

const index = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCars = await Car.find({
      $or: [{ status: 'active' }, { status: 'suspended' }]
    }).populate('category')
    res.render('admin/cars/index.ejs', { siteInfo, allCars })
  } catch (error) {
    res.render('error.ejs')
  }
}

const newForm = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCategories = await Category.find({ status: 'active' })

    res.render('admin/cars/new.ejs', { siteInfo, allCategories })
  } catch (error) {
    res.render('error.ejs')
  }
}

const editForm = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCategories = await Category.find({ status: 'active' })
    const car = await Car.findById(req.params.carId)

    res.render('admin/cars/edit.ejs', { siteInfo, allCategories, car })
  } catch (error) {
    res.render('error.ejs')
  }
}

const create = async (req, res) => {
  try {
    // First, get the user from the database
    const carInDatabase = await Car.findOne({
      name: req.body.name
    })

    // Check if there is existing user with same username !
    if (carInDatabase) {
      return res.send('car already published.')
    }

    // Save the user data in database
    req.body.status = 'active'
    req.body.adminAdded = req.session.userInfo._id
    req.body.photo = req.file.originalname

    const car = await Car.create(req.body)

    const photoExt = car.photo.split('.')
    const newPhotoName = car._id + '.' + photoExt[photoExt.length - 1]

    fs.renameSync(
      `./assets/uploads/cars/${car.photo}`,
      `./assets/uploads/cars/${newPhotoName}`
    )

    await Car.findByIdAndUpdate(car._id, {
      photo: newPhotoName
    })

    // redirect to users list
    res.redirect('/admin/cars')
  } catch (error) {
    res.render('error.ejs')
  }
}

const deleting = async (req, res) => {
  try {
    req.body.adminAdded = await Car.findByIdAndUpdate(req.params.carId, {
      status: 'deleted',
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/cars`)
  } catch (error) {
    res.render('error.ejs')
  }
}

const updating = async (req, res) => {
  try {
    if (req.file) {
      const photoExt = req.file.originalname.split('.')
      const newPhotoName =
        req.params.carId + '.' + photoExt[photoExt.length - 1]

      fs.renameSync(
        `./assets/uploads/cars/${req.file.originalname}`,
        `./assets/uploads/cars/${newPhotoName}`
      )

      req.body.photo = newPhotoName
    }
    req.body.adminAdded = req.session.userInfo._id

    const carInDatabase = await Car.findByIdAndUpdate(
      req.params.carId,
      req.body
    )

    // redirect to users list
    res.redirect('/admin/cars')
  } catch (error) {
    res.render('error.ejs')
  }
}

const reports = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    return res.send('report page')
  } catch (error) {
    res.render('error.ejs')
  }
}

const status = async (req, res) => {
  try {
    req.body.adminAdded = await Car.findByIdAndUpdate(req.params.carId, {
      status: req.params.state,
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/cars`)
  } catch (error) {
    res.render('error.ejs')
  }
}

module.exports = {
  index,
  newForm,
  editForm,
  create,
  deleting,
  updating,
  reports,
  status
}
