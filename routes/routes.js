const express = require('express')
const route = express.Router()
const authController = require('../controllers/auth')

route.post('/auth/:type/login', authController.login)
route.post('/auth/:type/signup', authController.create)
route.get('/auth/:userType/:operation', authController.show)

module.exports = route
