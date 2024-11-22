const { response } = require('express')
const User = require('../models/user.js')
const Info = require('../models/info.js')
const siteInfo = Info.find({})

const show = async (req, res) => {
  const userType = req.params.userType
  const operation = req.params.operation
  try {
    if (userType === 'admin') {
      const usersCount = await User.countDocuments({})
      if (operation === 'login') {
        if (usersCount === 0) {
          res.redirect('/auth/admin/create')
        } else {
          return res.send('show admin login page')
        }
      } else if (operation === 'logout') {
        return res.send('remove session and redirect to admin login page')
      } else if (operation === 'create') {
        if (usersCount > 0) {
          return res.send('redirect to login page')
        } else {
          res.render('auth/create.ejs', { userType })
        }
      } else {
        return res.send('show 404 error page')
      }
    } else if (userType === 'customer') {
      if (operation === 'login') {
        return res.send('show customer login page')
      } else if (operation === 'logout') {
        return res.send('remove session and redirect to admin login page')
      } else {
        return res.send('show 404 error page')
      }
    } else {
      return res.send('show 404 error page')
    }
  } catch (error) {}
}

const login = async (req, res) => {
  console.log('login')
}

const create = async (req, res) => {
  console.log('signup')
}

module.exports = { login, create, show }
