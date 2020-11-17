function check(value, param){
  let regex
  if(param === 'username'){
    regex = /^[a-z0-9_]{1,20}$/g
  } else if (param === 'password') {
    regex = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
  } else if (param === 'name') {
    regex = /^[a-zA-Z0-9]{1,30}$/g
  } else if (param === 'country') {
    regex = /^[a-zA-Z0-9&(),. ]{1,30}$/g
  } else if (param === 'email') {
    regex = /^([a-zA-Z0-9_\.-]{1,50})@([\da-z\.-]{1,40})\.([a-z\.]{2,5})$/g
  } else if (param === 'post_title') {
    regex = /^[a-zA-Z0-9 :,.?!'"#$%;()&-]{1,80}$/g
  } else if (param === 'post_content') {
    regex = /^[\s\S]+$/g
  } else{
    console.log('wrong parameter')
    return false
  }
  try {
    const isString = typeof value === 'string'
    const isValid = value.match(regex) !== null
    if (!(isString && isValid)){
      console.log('Invalid', param)
    }
    return isString && isValid
  } catch (error) {
    console.log('Check error:', error)
    return false
  }
}

function checkLoginForm(form){
  return check(form.username, 'username') &&
    check(form.password, 'password')
}

function checkSigninForm(form) {
  const isRequeredValid = check(form.username, 'username') &&
    check(form.password, 'password') &&
    check(form.email, 'email') &&
    check(form.first_name, 'name') &&
    check(form.country,'country')
  let isOptionalValid = true
  if (typeof form.last_name !== 'undefined'){
    isOptionalValid = typeof form.last_name === 'string' &&
      (form.last_name === '' || check(form.last_name, 'name'))
  }
  return isRequeredValid && isOptionalValid
}

function checkNewPostForm(form) {
  return check(form.title, 'post_title') &&
    check(form.content, 'post_content')
}

function checkMessageForm(form) {
  return Number.isInteger(form.sent_to) &&
    typeof form.content === 'string' &&
    form.content.length < 1000
}

module.exports = async function (req, _res, next) {
  try {
    let isValid
    if (req.route.path === '/login') {
      isValid = checkLoginForm(req.body)
    } else if (req.route.path === '/signup') {
      isValid = checkSigninForm(req.body)
    } else if (req.route.path === '/upload') {
      isValid = checkNewPostForm(req.body)
      if (isValid) {
        req.body.meta_title = req.body.content.slice(0, 100)
      }
    } else if (req.route.path === '/send') {
      isValid = checkMessageForm(req.body)
    } else {
      console.log('Wrong path to validate:', req.route.path)
      isValid = false
    }
    if (isValid) {
      next()
    } else {
      req.session.error = 'Invalid form'
      next('route')
    }
  } catch (error) {
    console.log('Error while checking form:', error)
    req.session.error = "Error while checking form"
    next('route')
  }
}
