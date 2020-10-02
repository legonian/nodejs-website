const express = require('express')
const router = express.Router()

const checkCaptcha = require('../middleware/check_captcha')

const User = require('../models/user_model')
const getUserBy = User.getBy
const getUserList = User.getList
const authUser = User.middleware.auth
const validateUser = User.middleware.validate
const validateSession = User.middleware.validateSession

const getPostsBy = require('../models/post_model').getBy

router.post('/login', checkCaptcha, validateUser, authUser, async function(req, res, next) {
    res.redirect('/user/profile')
})

router.post('/signup', checkCaptcha, validateUser, authUser, async function(req, res) {
    res.redirect('/user/profile')
})

router.get('/log_out', validateSession, function(req, res) {
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

router.get('/list', async function(req, res) {
  const ul = await getUserList()
  res.render('users_list', {userlist: ul})
})

router.get('/:userId/posts', async function(req, res) {
  const pl = await getPostsBy('user_id', req.params.userId)
  res.render('post_list', {postlist: Array.isArray(pl) ? pl : [pl]})
})

router.get('/:userId', async function(req, res, next) {
  const userId = parseInt(req.params.userId)
  const userData = await getUserBy('user_id', req.params.userId)
  if ( userData && !isNaN(userId))
    res.render('profile', {profile: userData})
  else {
    req.session.error = "No such user"
    next()
  }
})

module.exports = router