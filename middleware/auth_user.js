const User = require('../models/user')

function auth_user (option){
  return async function (req, res, next) {
    try {
      if(!req.captcha) {
        req.session.error = 'Authentication failed, please check captcha.'
        next()
      }else{
        if(option == 'login'){
          const temp_user = new User({name: req.body.username,
                                            pass: req.body.password})
          const db_user = await temp_user.auth()
        }else if(option == 'signup'){
          const temp_user = new User({name: req.body.username, 
                                      pass: req.body.password, 
                                      first_name: req.body.first_name})
          const db_user = await temp_user.sign_up()
        }else{
          const db_user = null
        }

        if(db_user){
          req.session.regenerate(function(){
            req.session.user = db_user
            req.session.success = 'Authenticated as ' + db_user.nickname
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
}

module.exports = auth_user