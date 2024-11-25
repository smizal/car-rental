const express = require('express')
const route = express.Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/users')

// auth controller
route.post('/auth/:userType/login', authController.login)
route.post('/auth/:userType/create', authController.create)
route.get('/auth/:userType/:operation', authController.show)
route.get('/admin', authController.index)

// user controller
route.get('/admin/users', userController.userIndex)
route.get('/admin/users/add', userController.newUserForm)
route.get('/admin/users/edit/:userId', userController.updateUserForm)
route.post('/admin/users', userController.createUser)
route.get('/admin/users/report/:userId', userController.userReport)
route.delete('/admin/users/:userId', userController.deleteUser)
route.put('/admin/users/status/:state/:userId', userController.status)
route.put('/admin/users/:userId', userController.updateUser)

module.exports = route
