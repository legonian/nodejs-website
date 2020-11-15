function check(value, param){
  let regex
  if(param === 'username'){
    regex = /^[a-zA-Z0-9]{1,80}$/g
  } else if (param === 'user_id') {
    regex = /^\d+$/g
  } else if (param === 'password') {
    regex = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
  } else if (param === 'name') {
    regex = /^[a-zA-Z0-9]{1,30}$/g
  } else if (param === 'email') {
    regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,5})$/g
  } else if (param === 'post_title') {
    regex = /^[a-zA-Z0-9 ]{1,80}$/g
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
      console.log('Invalid', param, ':', value)
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
    check(form.first_name, 'name')
    // && check(form.country,'country')
  
  let isOptionalValid = true
  if (typeof form.last_name !== 'undefined'){
    isOptionalValid = check(form.last_name, 'name')
    // && check(form.avatar,'url')
  }
  return isRequeredValid && isOptionalValid
}

function checkNewPostForm(form) {
  const isRequeredValid = check(form.title, 'post_title') &&
    check(form.content, 'post_content')
    // check(form.user_id, 'user_id')
  return isRequeredValid
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
