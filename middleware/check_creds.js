function checkProp( creds, prop, matchExp ) {
  let isOK = ( prop in creds ) && ( typeof creds[prop] === 'string' )
  isOK = isOK && creds[prop].match(matchExp) !== null
  if (! isOK) console.log(prop, [creds[prop]])
  return isOK
}

module.exports = async function ( req, res, next ) {
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

    if ( isValid && req.userAuthMethod === 'signup' ) {
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
    
    req.credsIsValid = isValid
    
    if ( !isValid ) {
      req.session.error = 'Creds is invalid.'
      next('route')
      //res.send('creds is invalid')
    } else { next() }

  } catch (error) {
    next(error)
  }
}