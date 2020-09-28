const { makeQuery } = require('./db')
const bcrypt = require('bcrypt')

User = {}
User.getBy = async function( param, value ) {
  const query = `SELECT * FROM users WHERE ${param} = $1`
  const vars_arr = [value]
  return await makeQuery(query, vars_arr, async dbRes =>{
    return dbRes
  })
}
User.check = async function( dbUser ) {
  const query = 'SELECT * FROM users WHERE username = $1'
  const vars_arr = [dbUser.username]
  return await makeQuery(query, vars_arr, async dbRes =>{
    if( dbRes && dbRes.user_id === dbUser.user_id ){
      return dbRes
    } else {
      return false
    }
  })
}
User.auth = async function( obj ) {
  const query = 'SELECT * FROM users WHERE username = $1'
  const vars_arr = [obj.username]
  return await makeQuery(query, vars_arr, async dbRes =>{
    if( dbRes && await bcrypt.compare( obj.password, dbRes.hash ) ){
      return dbRes
    } else {
      return false
    }
  })
}
User.add = async function( obj ) {
  if ( await User.auth(obj) ) {
    return false 
  } else {
    const hash = await bcrypt.hash(obj.password, 12)
    const query = `INSERT INTO users(username,
                                     hash,
                                     first_name)
                   VALUES ($1, $2, $3)`
    const vars_arr = [obj.username, hash, obj.first_name]

    await makeQuery(query, vars_arr)
    return await User.auth(obj)
  }
}
User.changeParameter = async function( obj, param, cb ) {
  const pastUserData = await User.check(obj)
  //console.log('pastUserData', pastUserData)
  if(pastUserData){
    const query = `UPDATE users SET ${param} = $1 WHERE user_id = $2`
    const vars_arr = [cb(pastUserData[param]), obj.user_id]
    //console.log(vars_arr)
    await makeQuery(query, vars_arr)
    return await User.check(obj)
  } else { return false }
}
User.getList = async function () {
  const query = 'SELECT user_id, username FROM users'
  return await makeQuery(query, [], async dbRes =>{
    return dbRes
  })
}

User.middleware = {}
User.middleware.auth = async function (req, res, next) {
  try {
    const get_dbUser = async () => {
      if (req.route.path === '/login'){
        return await User.auth(req.body)
      }else if( req.route.path === '/signup' ){
        return await User.add(req.body)
      }
    }
    const dbRes = await get_dbUser()
    if(dbRes){
      req.session.regenerate(function(){
        req.session.user = dbRes
        req.session.success = 'Authenticated as ' + dbRes.username
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
User.middleware.validate = async function ( req, res, next ) {
  function checkProp( creds, prop, matchExp ) {
    let isOK = ( prop in creds ) && ( typeof creds[prop] === 'string' )
    isOK = isOK && creds[prop].match(matchExp) !== null
    if (! isOK) console.log(prop, [creds[prop]])
    return isOK
  }

  try {
    let isValid = checkProp(
      req.body,
      'username',
      /^[a-z0-9_-]{3,20}$/g
    ) && checkProp(
      req.body,
      'password',
      /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
    )

    if ( isValid && req.route.path === '/signup' ) {
      isValid = checkProp(
        req.body,
        'first_name',
        /^[a-zA-Z0-9]{1,30}$/g
      ) /* && checkProp(
        req.body,
        'email',
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,5})$/g
      )*/
    }
    
    if ( !isValid ) {
      req.session.error = 'Credentials is invalid.'
      next('route')
    } else { next() }

  } catch (error) {
    next(error)
  }
}
User.middleware.validateSession = async function ( req, res, next ) {
  try {
    if ( req.session.user ) {
      if ( await User.check(req.session.user) ) { next() }
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

module.exports = User