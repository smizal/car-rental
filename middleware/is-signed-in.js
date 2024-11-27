const isSignedIn = (req, res, next) => {
  if (req.session.user) return next()
  res.redirect('/auth/customer/login')
}

module.exports = isSignedIn
