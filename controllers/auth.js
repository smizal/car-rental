const { response } = require('express')
const User = require('../models/user.js')
const Info = require('../models/info.js')
const Customer = require('../models/customer.js')

const bcrypt = require('bcrypt')

const show = async (req, res) => {
  try {
    const siteInfo = await Info.findOne({})
    const userType = req.params.userType
    const operation = req.params.operation
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
    res.render('error.ejs')
  }
}

const login = async (req, res) => {
  try {
    const userType = req.params.userType
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userType != 'admin') {
      userInDatabase = await Customer.findOne({
        username: req.body.username
      })
    }
    console.log('userInDatabase', userInDatabase)
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.')
    }

    // Check if the password is correct, compare them
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )

    if (!validPassword) {
      return res.send('Login failed. Please try again.')
    }

    // Save any required data in session
    if (userType === 'admin') {
      console.log('admin session')
      req.session.userInfo = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
        role: userInDatabase.role
      }
    } else {
      req.session.userInfo = {
        name: userInDatabase.name,
        _id: userInDatabase._id
      }
    }
    req.session.save(() => {
      if (userType === 'admin') {
        console.log('admin redirect')
        res.redirect(`/${userType}`)
      } else {
        res.redirect(`/`)
      }
    })
  } catch (error) {
    res.render('error.ejs')
  }
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
    req.session.userInfo = {
      username: user.username,
      _id: user._id,
      role: user.role
    }
    req.session.save(() => {
      res.redirect('/admin')
    })
  } catch (error) {
    res.render('error.ejs')
  }
}

const index = async (req, res) => {
  const siteInfo = await Info.findOne({})
  res.render('error.ejs')
}

module.exports = { login, create, show, index }
