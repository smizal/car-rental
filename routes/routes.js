const express = require('express')
const app = express()
const route = express.Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/users')
const categoryController = require('../controllers/categories')
const carController = require('../controllers/cars')
const customerController = require('../controllers/customers')
const requestController = require('../controllers/requests')
const isSignedIn = require('../middleware/is-signed-in')

const multer = require('multer')
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = 'users'
    if (req.url.startsWith('/admin/categories')) {
      path = 'categories'
    } else if (req.url.startsWith('/admin/cars')) {
      path = 'cars'
    }
    cb(null, `./assets/uploads/${path}`)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })

// frontend controller (customer controller)
route.get('/', customerController.index)
route.get('/cars', customerController.cars)
route.get('/request/:carId', customerController.request)
route.post('/request/:carId', customerController.postRequest)

// auth controller
route.post('/auth/:userType/login', authController.login)
route.post('/auth/:userType/create', authController.create)
route.get('/auth/:userType/:operation', authController.show)
route.get('/admin', isSignedIn, authController.index)

// user controller
route.get('/admin/users', isSignedIn, userController.userIndex)
route.get('/admin/users/add', isSignedIn, userController.newUserForm)
route.get(
  '/admin/users/edit/:userId',
  isSignedIn,
  userController.updateUserForm
)
route.post('/admin/users', isSignedIn, userController.createUser)
route.get('/admin/users/report/:userId', isSignedIn, userController.userReport)
route.delete('/admin/users/:userId', isSignedIn, userController.deleteUser)
route.put(
  '/admin/users/status/:state/:userId',
  isSignedIn,
  userController.status
)
route.put('/admin/users/:userId', isSignedIn, userController.updateUser)

// categories controller
route.get('/admin/categories', isSignedIn, categoryController.index)
route.get('/admin/categories/add', isSignedIn, categoryController.newForm)
route.get(
  '/admin/categories/edit/:catId',
  isSignedIn,
  categoryController.editForm
)
route.post(
  '/admin/categories',
  isSignedIn,
  upload.single('photo'),
  categoryController.create
)
route.get(
  '/admin/categories/report/:catId',
  isSignedIn,
  categoryController.reports
)
route.delete(
  '/admin/categories/:catId',
  isSignedIn,
  categoryController.deleting
)
route.put(
  '/admin/categories/status/:state/:catId',
  isSignedIn,
  categoryController.status
)
route.put(
  '/admin/categories/:catId',
  isSignedIn,
  upload.single('photo'),
  categoryController.updating
)

// cars controller
route.get('/admin/cars', isSignedIn, carController.index)
route.get('/admin/cars/add', isSignedIn, carController.newForm)
route.get('/admin/cars/edit/:carId', isSignedIn, carController.editForm)
route.post(
  '/admin/cars',
  isSignedIn,
  upload.single('photo'),
  carController.create
)
route.get('/admin/cars/report/:carId', isSignedIn, carController.reports)
route.delete('/admin/cars/:carId', isSignedIn, carController.deleting)
route.put('/admin/cars/status/:state/:carId', isSignedIn, carController.status)
route.put(
  '/admin/cars/:carId',
  isSignedIn,
  upload.single('photo'),
  carController.updating
)

// requests controller
route.get('/admin/requests', isSignedIn, requestController.index)
route.put(
  '/admin/requests/:state/:requestId',
  isSignedIn,
  requestController.status
)

module.exports = route
