class FormValidator {
  constructor (req) {
    this.route = String(req.route.path)
    this.form = req.body
  }

  get listofRoutes () {
    return [
      {
        path: '/login', // Login User
        requeredParams: ['username', 'password']
      }, {
        path: '/signup', // Signup User
        requeredParams: ['username', 'password', 'email', 'first_name', 'country'],
        optionalParam: ['last_name']
      }, {
        path: '/update', // Change User
        requeredParams: ['password', 'param', 'value']
      }, {
        path: '/delete', // Delete User
        requeredParams: ['password']
      }, {
        path: '/upload', // Upload Post
        requeredParams: ['title', 'content']
      }, {
        path: '/send', // Send Message
        requeredParams: ['sent_to', 'content']
      }
    ]
  }

  check (param, val) {
    try {
      if (typeof param === 'undefined') {
        return false
      } else if (param === 'username') {
        return val.match(/^[a-z0-9_]{1,20}$/g) !== null
      } else if (param === 'password') {
        return val.match(/(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g) !== null
      } else if (param === 'email') {
        return val.match(/^([a-zA-Z0-9_.-]{1,50})@([\da-z.-]{1,40})\.([a-z.]{2,5})$/g) !== null
      } else if (param === 'first_name') {
        return val.match(/^[a-zA-Z0-9]{1,30}$/g) !== null
      } else if (param === 'last_name') {
        return val.match(/^[a-zA-Z0-9]{1,30}$/g) !== null
      } else if (param === 'avatar') {
        return val.match(/^https:\/\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_-]+\/[\S]+$/g) !== null
      } else if (param === 'country') {
        return val.match(/^[a-zA-Z0-9&(),. ]{1,30}$/g) !== null
      } else if (param === 'title') {
        return val.match(/^[a-zA-Z0-9 :,.?!'"#$%;()&-]{1,80}$/g) !== null
      } else if (param === 'content') {
        return val !== '' && val.match(/^[\s\S]+$/g) !== null
      } else if (param === 'user_info') {
        return val.match(/^[a-zA-Z0-9 :,.?!'"#$%;()&-]{1,420}$/g) !== null
      } else if (param === 'sent_to') {
        return Number.isInteger(val)
      } else if (param === 'param') {
        const params = [
          'username',
          'email',
          'first_name',
          'last_name',
          'avatar',
          'password',
          'user_info',
          'country'
        ]
        return params.includes(val)
      } else if (param === 'value') {
        if (this.form.param !== 'value') {
          return this.check(this.form.param, val)
        } else {
          return false
        }
      } else {
        console.log('Wrong parameter:', [param])
        return false
      }
    } catch (err) {
      console.log('Error when checking:', [param])
      return false
    }
  }

  validate () {
    try {
      let isValid = false
      for (const r of this.listofRoutes) {
        if (this.route === r.path) {
          isValid = true
          for (const p of r.requeredParams) {
            isValid = isValid && this.check(p, this.form[p])
          }
          if (typeof r.optionalParam !== 'undefined') {
            for (const p of r.optionalParam) {
              if (this.form[p]) {
                isValid = isValid && this.check(p, this.form[p])
              }
            }
          }
        }
      }
      return isValid
    } catch (err) {
      console.log('Error when validating', err)
      return false
    }
  }
}

module.exports = async function (req, _res, next) {
  try {
    const form = new FormValidator(req)
    if (form.validate()) {
      next()
    } else {
      req.session.error = 'Invalid form'
      next('route')
    }
  } catch (error) {
    console.log('Error while checking form:', error)
    req.session.error = 'Error while checking form'
    next('route')
  }
}
