const { response } = require('express')
const User = require('../models/user.js')
const Info = require('../models/info.js')

const bcrypt = require('bcrypt')

const userIndex = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allUsers = await User.find({})
    res.render('admin/users/index.ejs', { siteInfo, allUsers })
  } catch (error) {
    return res.send(error)
  }
}

const newUserForm = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    res.render('admin/users/new.ejs', { siteInfo })
  } catch (error) {
    return res.send(error)
  }
}

const updateUserForm = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const user = await User.findById(req.params.userId)
    res.render('admin/users/edit.ejs', { siteInfo, user })
  } catch (error) {
    return res.send(error)
  }
}

const createUser = async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username })

    // Check if there is existing user with same username !
    if (userInDatabase) {
      return res.send('Username already taken.')
    }

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    // Save the user data in database
    req.body.status = 'active'
    req.body.adminAdded = req.session.userInfo._id
    const user = await User.create(req.body)

    // redirect to users list
    res.redirect('/admin/users')
  } catch (error) {
    return res.send(error)
  }
}

const deleteUser = async (req, res) => {
  try {
    req.body.adminAdded = await User.findByIdAndUpdate(req.params.userId, {
      status: 'deleted',
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/users`)
  } catch (error) {
    return res.send(error)
  }
}

const updateUser = async (req, res) => {
  try {
    // Encrypt the password
    if (req.body.password != '') {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hashedPassword
    } else {
      delete req.body.password
    }
    delete req.body.username

    req.body.adminAdded = req.session.userInfo._id
    const userInDatabase = await User.findByIdAndUpdate(
      req.params.userId,
      req.body
    )

    // redirect to users list
    res.redirect('/admin/users')
  } catch (error) {
    return res.send(error)
  }
}

const userReport = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    return res.send('update page')
  } catch (error) {
    return res.send(error)
  }
}

const status = async (req, res) => {
  try {
    req.body.adminAdded = await User.findByIdAndUpdate(req.params.userId, {
      status: req.params.state,
      adminUpdated: req.session.userInfo._id
    })
    res.redirect(`/admin/users`)
  } catch (error) {
    return res.send(error)
  }
}

module.exports = {
  userIndex,
  newUserForm,
  updateUserForm,
  createUser,
  deleteUser,
  updateUser,
  userReport,
  status
}
