const passUserInfo = (req, res, next) => {
  res.locals.userInfo = req.session.userInfo ? req.session.userInfo : null
  res.locals.message = req.session.message ? req.session.message : null
  next()
}

module.exports = passUserInfo
