const User = require('../models/user-model')

module.exports = async function (req, _res, next) {
  try {
    const dbRes = await (async () => {
      if (req.route.path === '/login') {
        return await User.authenticate(req.body)
      } else if (req.route.path === '/signup') {
        return await User.create(req.body)
      }
    })()
    if (dbRes) {
      req.session.regenerate(function () {
        req.session.user = dbRes
        req.session.success = 'Authenticated as ' + dbRes.username
        next()
      })
    } else {
      req.session.error = "Can't access with this credentials."
      next('route')
    }
  } catch (error) {
    console.log('error:', error)
    req.session.error = "Can't access with this credentials."
    next('route')
  }
}
