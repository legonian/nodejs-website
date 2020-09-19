const DB = require('../models/db')

module.exports = async function (req, res, next) {
  try {
    const get_dbUser = async () => {
      if (req.route.path === '/login'){
        return await DB.user.get(req.body)
      }else if( req.route.path === '/signup' ){
        return await DB.user.set(req.body)
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