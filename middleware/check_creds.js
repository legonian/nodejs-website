function checkProp(prop, options) {
  let isOK = options.run && typeof prop === options.type
  if ( isOK && options.type === 'string' ){
    isOK = options.minLength <= prop.length && prop.length <= options.maxLength
    isMatched = prop.match(options.matchExp) !== null
    isOK = isOK ? isMatched : false
  }
  // console.log('isOK =', [isOK])
  return isOK
}

module.exports = async function (req, res, next) {
  try {
    let isValid = true
    const credsToCheck = req.body
    //console.log([credsToCheck])

    let propsToCheck = ['username', 'password']
    if ( req.userAuthMethod === 'signup' ) propsToCheck.push('first_name')

    for ( prop of propsToCheck ) {
      if ( prop in credsToCheck ) {
        console.log('req.body has ' + prop)
      } else {
        isValid = false
      }
    }
    checkProp(req.body.username, { run: isValid,
                                   type: 'string',
                                   minLength: 1,
                                   maxLength: 20,
                                   matchExp: /[A-Z]/g})

    req.credsIsValid = isValid
    
    next()
  } catch (error) {
    next(error)
  }
}