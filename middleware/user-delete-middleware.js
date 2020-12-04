const User = require('../models/user-model')

module.exports = async function (req, _res, next) {
  req.body.username = req.session.user.username
  if (await User.delete(req.body)) {
    req.session.destroy(function () {
      next()
    })
  } else {
    next('route')
  }
}
