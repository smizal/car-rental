const isSignedIn = (req, res, next) => {
  if (req.session.userInfo) return next()
  res.redirect('/auth/customer/login')
}

module.exports = isSignedIn
