const DB = require('../models/db')

module.exports = async function (req, res, next) {
  try {
    if( process.env.NODE_ENV === 'production' && !req.captcha ) {
      req.session.error = 'Authentication failed, please check captcha.'
      next()
    }else{
      const get_dbUser = async () => {
        if (req.userAuthMethod === 'login'){
          return await DB.getUser(req.body)
        }else if( req.userAuthMethod === 'signup' ){
          return await DB.setUser(req.body)
        }
      }
      const dbUser = await get_dbUser()

      if(dbUser){
        req.session.regenerate(function(){
          req.session.user = dbUser
          req.session.success = 'Authenticated as ' + dbUser.username
          next()
        })
      }
      else{
        req.session.error = 'Authentication failed, please check your '
          + ' username and password.'
        next()
      }
    }
  }catch (error) {
    next(error)
  }
}