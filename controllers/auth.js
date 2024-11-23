const { response } = require('express')
const User = require('../models/user.js')
const Info = require('../models/info.js')
const siteInfo = Info.find({})
const bcrypt = require('bcrypt')

const show = async (req, res) => {
  const userType = req.params.userType
  const operation = req.params.operation
  try {
    if (userType === 'admin') {
      const usersCount = await User.countDocuments({})
      if (operation === 'login') {
        if (usersCount === 0) {
          res.redirect(`/auth/${userType}/create`)
        } else {
          res.render('auth/login.ejs', { userType, siteInfo })
        }
      } else if (operation === 'logout') {
        req.session.destroy(() => {
          res.redirect(`/auth/${userType}/login`)
        })
      } else if (operation === 'create') {
        if (usersCount > 0) {
          res.redirect(`/auth/${userType}/login`)
        } else {
          res.render('auth/create.ejs', { userType })
        }
      } else {
        return res.send('show 404 error page')
      }
    } else if (userType === 'customer') {
      if (operation === 'login') {
        res.render('auth/login.ejs', { userType, siteInfo })
      } else if (operation === 'logout') {
        req.session.destroy(() => {
          res.redirect(`/auth/${userType}/login`)
        })
      } else {
        return res.send('show 404 error page')
      }
    } else {
      return res.send('show 404 error page')
    }
  } catch (error) {
    return res.send(error)
  }
}

const login = async (req, res) => {
  console.log('login')
}

const create = async (req, res) => {
  try {
    // Check if the passwords are same
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
    }

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    req.body.role = 'superadmin'
    req.body.status = 'active'
    // Save the user data in database
    const user = await User.create(req.body)
    const info = await Info.create(req.body)
    req.session.user = {
      username: user.username,
      _id: user._id,
      role: user.role
    }
    req.session.save(() => {
      res.redirect('/auth/admin/login')
    })
  } catch (error) {
    return res.send(error)
  }
}

module.exports = { login, create, show }
