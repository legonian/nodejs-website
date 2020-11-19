const User = require('../models/user-model')

module.exports = async function (req, res, next) {
  try {
    if (req.session.user) {
      const refrashedUser = await User.get('username', req.session.user.username)
      if (refrashedUser) {
        req.session.user = refrashedUser
        res.locals.user = refrashedUser
        next()
      } else {
        req.session.destroy(function () {
          res.redirect('/')
        })
      }
    } else {
      req.session.error = 'Unauthorized Access. Please Log In.'
      next('route')
    }
  } catch (error) {
    console.log('Error on validating session:', error)
    req.session.error = 'Error on validating session'
    next('route')
  }
}
