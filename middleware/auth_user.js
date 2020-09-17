const DB = require('../models/db')

module.exports = async function (req, res, next) {
  try {
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
      req.session.error = "Can't access to with this credentials."
      next('route')
    }
  }catch (error) {
    next(error)
  }
}