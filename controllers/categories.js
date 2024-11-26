const { response } = require('express')
const Category = require('../models/category.js')
const Info = require('../models/info.js')
const User = require('../models/user.js')
const fs = require('fs')

const index = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allCategories = await Category.find({
      $or: [{ status: 'active' }, { status: 'suspended' }]
    })
    res.render('admin/categories/index.ejs', { siteInfo, allCategories })
  } catch (error) {
    return res.send(error)
  }
}

const newForm = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    res.render('admin/categories/new.ejs', { siteInfo })
  } catch (error) {
    return res.send(error)
  }
}

const editForm = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const category = await Category.findById(req.params.catId)
    res.render('admin/categories/edit.ejs', { siteInfo, category })
  } catch (error) {
    return res.send(error)
  }
}

const create = async (req, res) => {
  try {
    // First, get the user from the database
    const categoryInDatabase = await Category.findOne({
      name: req.body.name
    })

    // Check if there is existing user with same username !
    if (categoryInDatabase) {
      return res.send('category already published.')
    }

    // Save the user data in database
    req.body.status = 'active'
    req.body.adminAdded = req.session.userInfo._id
    req.body.photo = req.file.originalname

    const category = await Category.create(req.body)

    const photoExt = category.photo.split('.')
    const newPhotoName = category._id + '.' + photoExt[photoExt.length - 1]

    fs.renameSync(
      `./assets/uploads/${category.photo}`,
      `./assets/uploads/${newPhotoName}`
    )

    await Category.findByIdAndUpdate(category._id, {
      photo: newPhotoName
    })

    // redirect to users list
    res.redirect('/admin/categories')
  } catch (error) {
    return res.send(error)
  }
}

const deleting = async (req, res) => {
  try {
    req.body.adminAdded = await Category.findByIdAndUpdate(req.params.catId, {
      status: 'deleted',
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/categories`)
  } catch (error) {
    return res.send(error)
  }
}

const updating = async (req, res) => {
  try {
    if (req.file) {
      const photoExt = req.file.originalname.split('.')
      const newPhotoName =
        req.params.catId + '.' + photoExt[photoExt.length - 1]

      fs.renameSync(
        `./assets/uploads/${req.file.originalname}`,
        `./assets/uploads/${newPhotoName}`
      )

      req.body.photo = newPhotoName
    }
    req.body.adminAdded = req.session.userInfo._id

    const categoryInDatabase = await Category.findByIdAndUpdate(
      req.params.catId,
      req.body
    )

    // redirect to users list
    res.redirect('/admin/categories')
  } catch (error) {
    return res.send(error)
  }
}

const reports = async (req, res) => {
  try {
    const siteInfo = await Category.findOne({})
    return res.send('update page')
  } catch (error) {
    return res.send(error)
  }
}

const status = async (req, res) => {
  try {
    req.body.adminAdded = await Category.findByIdAndUpdate(req.params.catId, {
      status: req.params.state,
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/categories`)
  } catch (error) {
    return res.send(error)
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
