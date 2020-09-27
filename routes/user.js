const express = require('express')
const router = express.Router()

const checkCaptcha = require('../middleware/check_captcha')

const User = require('../models/user_model')
const getUserBy = User.getBy
const authUser = User.middleware.auth
const validateUser = User.middleware.validate
const validateSession = User.middleware.validateSession

router.post('/login', checkCaptcha,
                      validateUser,
                      authUser,
  async function(req, res, next) {
    res.redirect('/user/profile')
})

router.post('/signup', checkCaptcha,
                       validateUser,
                       authUser,
  async function(req, res) {
    res.redirect('/user/profile')
})

router.get('/log_out', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/')
  })
})

router.get('/profile', validateSession, function(req, res) {
  res.render('profile', {profile: res.locals.user})
})

router.get('/messages', validateSession, function(req, res) {
  res.render('messages')
})

router.get('/settings', validateSession, function(req, res) {
  res.render('settings')
})

router.get('/:userId', async function(req, res, next) {
  const userData = await getUserBy('user_id', req.params.userId)
  if ( userData )
    res.render('profile', {profile: userData})
  else {
    req.session.error = "No such user"
    next('route')
  }
})

module.exports = router