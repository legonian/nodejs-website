const User = require('../models/user_model')

module.exports = async function (req, res, next) {
  try {
    if( process.env.NODE_ENV === 'production' && !req.captcha ) {
      req.session.error = 'Authentication failed, please check captcha.'
      next()
    }else{
      const get_dbUser = async () => {
        if (req.userAuthMethod === 'login'){
          const tempUser = new User({name: req.body.username,
                                     pass: req.body.password})
          return tempUser.auth()
        }else if( req.userAuthMethod === 'signup' ){
          const tempUser = new User({name: req.body.username, 
                                      pass: req.body.password, 
                                      first_name: req.body.first_name})
          return tempUser.sign_up()
        }
      }

      const dbUser = await get_dbUser()

      if(dbUser){
        req.session.regenerate(function(){
          req.session.user = dbUser
          req.session.success = 'Authenticated as ' + dbUser.nickname
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