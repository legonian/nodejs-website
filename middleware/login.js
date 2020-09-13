const User = require('../models/user')

function login_user(){
  return async function (err, req, res, next) {
    try {
      if(!req.captcha) {
        req.session.error = 'Authentication failed, please check captcha.'
        res.redirect('/')
      }
      
      const temp_user = new User({name: req.body.username, pass: req.body.password})
      const db_user = await temp_user.auth()

      if(db_user){
        req.session.regenerate(function(){
          req.session.user = db_user
          req.session.success = 'Authenticated as ' + db_user.nickname
        })
        next()
      }
      else{
        req.session.error = 'Authentication failed, please check your '
          + ' username and password.'
        res.redirect('/')
      }
    }catch (error) {
      next(error)
    }
  }
}

module.exports = login_user()