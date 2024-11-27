const express = require('express')
const app = express()
const route = express.Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/users')
const categoryController = require('../controllers/categories')
const carController = require('../controllers/cars')
const customerController = require('../controllers/customers')
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

// auth controller
route.post('/auth/:userType/login', authController.login)
route.post('/auth/:userType/create', authController.create)
route.get('/auth/:userType/:operation', authController.show)
route.get('/admin', isSignedIn, authController.index)

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
route.get('/admin/categories', isSignedIn, categoryController.index)
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

// cars controller
route.get('/admin/cars', carController.index)
route.get('/admin/cars/add', carController.newForm)
route.get('/admin/cars/edit/:carId', carController.editForm)
route.post('/admin/cars', upload.single('photo'), carController.create)
route.get('/admin/cars/report/:carId', carController.reports)
route.delete('/admin/cars/:carId', carController.deleting)
route.put('/admin/cars/status/:state/:carId', carController.status)
route.put('/admin/cars/:carId', upload.single('photo'), carController.updating)

module.exports = route
