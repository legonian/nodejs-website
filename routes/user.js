const express = require('express')
const router = express.Router()

const checkCaptcha = require('../middleware/check_captcha')
const validateUser = require('../middleware/validate_user')
const authUser = require('../middleware/auth_user')

const DB = require('../models/db')

router.post('/login', checkCaptcha,
                      validateUser,
                      authUser,
  async function(req, res, next) {
    res.redirect('/user/profile')
})

router.post('/signup', checkCaptcha,
                       validateUser,
                       authUser,
  async function(req, res, next) {
    res.redirect('/user/profile')
})

router.get('/log_out', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/')
  })
})

router.get('/profile', function(req, res) {
  if (res.locals.user){
    res.render('profile', {profile: res.locals.user})
  }
  else{
    res.send('Not signed. <a href="/">Click</a> to go to main page.')
  }
})

router.get('/:userId', async function(req, res, next) {
  const userData = await DB.user.getBy('user_id', req.params.userId)
  if ( userData )
    res.render('profile', {profile: userData})
  else {
    req.session.error = "No such user"
    next('route')
  }
})

module.exports = router