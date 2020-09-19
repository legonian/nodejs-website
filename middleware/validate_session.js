const DB = require('../models/db')

module.exports = async function ( req, res, next ) {
  try {
    if ( req.session.user ) {
      const isSessionValid = await DB.user.check(req.session.user)
      if ( isSessionValid ) { next() }
      else {
        req.session.error = 'Credentials is invalid.'
        next('route')
      }
    } else {
      req.session.error = 'Unauthorized Access! Please Log In.'
      next('route')
    }
  } catch (error) {
    next(error)
  }
}