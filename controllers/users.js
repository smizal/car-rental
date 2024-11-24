const { response } = require('express')
const User = require('../models/user.js')
const Info = require('../models/info.js')

const userIndex = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const allUsers = await User.find({})
    res.render('admin/users/index.ejs', { siteInfo, allUsers })
  } catch (error) {
    return res.send(error)
  }
}

const newUser = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    return res.send('new/update form page')
  } catch (error) {
    return res.send(error)
  }
}

const createUser = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    return res.send('add new user page')
  } catch (error) {
    return res.send(error)
  }
}

const deleteUser = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    return res.send('delete page')
  } catch (error) {
    return res.send(error)
  }
}

const updateUser = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    return res.send('update page')
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

module.exports = {
  userIndex,
  newUser,
  createUser,
  deleteUser,
  updateUser,
  userReport
}
