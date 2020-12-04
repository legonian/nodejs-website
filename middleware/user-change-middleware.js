const User = require('../models/user-model')

module.exports = async function (req, _res, next) {
  req.body.username = req.session.user.username
  const changedUser = await User.change(req.body)
  if (changedUser) {
    req.session.user = changedUser
    next()
  } else {
    next('route')
  }
}
