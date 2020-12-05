const User = require('../models/user-model')

exports.authUser = async function (req, _res, next) {
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

exports.changeUser = async function (req, _res, next) {
  req.body.username = req.session.user.username
  const changedUser = await User.change(req.body)
  if (changedUser) {
    req.session.user = changedUser
    next()
  } else {
    next('route')
  }
}

exports.deleteUser = async function (req, _res, next) {
  req.body.username = req.session.user.username
  if (await User.delete(req.body)) {
    req.session.destroy(function () {
      next()
    })
  } else {
    next('route')
  }
}
