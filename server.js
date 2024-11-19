// all required libraries
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const multer = require('multer')
const session = require('express-session')
const MongoStore = require('connect-mongo')

// initialize some parameters
const app = express()
const port = process.env.PORT ? process.env.PORT : 3003
const upload = multer({ dest: 'img/' })
const path = require('path')

// add required middlewares, if any

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}`)
})

// import models
/* const User = require('./models/user.js')
const Customer = require('./models/customer.js')
const Category = require('./models/category.js')
const Car = require('./models/car.js')
const Booking = require('./models/booking.js') */

// import the routes
// const routes = require('./routes/routes.js')

// Log the HTTP requests
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

// Managing sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)

// use middlewares, if any

// use the route file
//app.use(routes)

app.get('*', function (req, res) {
  res.status(404).send(`Error: page not found.`)
})

// add listener
const handleServerError = (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Warning! Port ${port} is already in use!`)
  } else {
    console.log('Error:', err)
  }
}

app
  .listen(port, () => {
    console.log(`The express app is ready on port ${port}!`)
  })
  .on('error', handleServerError)