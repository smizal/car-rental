const express = require('express')
const route = express.Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/users')
const categoryController = require('../controllers/categories')

const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

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

// categories controller
route.get('/admin/categories', categoryController.index)
route.get('/admin/categories/add', categoryController.newForm)
route.get('/admin/categories/edit/:catId', categoryController.editForm)
route.post(
  '/admin/categories',
  upload.single('photo'),
  categoryController.create
)
route.get('/admin/categories/report/:catId', categoryController.reports)
route.delete('/admin/categories/:catId', categoryController.deleting)
route.put('/admin/categories/status/:state/:catId', categoryController.status)
route.put(
  '/admin/categories/:catId',
  upload.single('photo'),
  categoryController.updating
)

module.exports = route
