const express = require('express')
const router = express.Router()

const profileRouter = require('./profile')

const setAuthMethod = require('../middleware/set_auth_method')
const checkCaptcha = require('../middleware/check_captcha')
const authUser = require('../middleware/auth_user')
const checkCreds = require('../middleware/check_creds')

router.use('/profile', profileRouter)

router.post('/login', setAuthMethod('login'),
                      checkCaptcha,
                      checkCreds,
                      authUser,
async function(req, res) {
  if (req.session.user) {
    res.redirect('/user/profile')
  }
  else {
    res.redirect('/')
  }
})

router.post('/signup', setAuthMethod('signup'),
                       checkCaptcha,
                       checkCreds,
                       authUser,
async function(req, res) {
  if (req.session.user) {
    res.redirect('/user/profile')
  }
  else {
    res.redirect('/')
  }
})

router.get('/log_out', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/')
  })
})

module.exports = router