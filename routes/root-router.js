const express = require('express')
const router = express.Router()

const User = require('../models/user-model')

const validateSession = require('../middleware/validate-session-middleware')

router.get('/', function (_req, res) {
  res.render('index')
})

router.get('/new_post',
  validateSession,
  function (_req, res) {
    res.render('post/new-post')
  }
)

router.get('/signup_page',
  function (req, res) {
    if (req.session.user) {
      res.redirect('/')
    } else {
      res.render('user-signup', { username: req.query.username })
    }
  }
)

router.get('/userlist', async function (_req, res) {
  const ul = await User.getAllUsers()
  res.render('user-list', { userlist: ul })
})

router.get('/messages',
  validateSession,
  function (_req, res) {
    res.render('user-messages')
  }
)

router.get('/settings',
  validateSession,
  function (_req, res) {
    const profile = [
      [
        'Username',
        res.locals.user.username,
        'change-username'],
      [
        'Email address',
        res.locals.user.email,
        'change-email'],
      [
        'First Name',
        res.locals.user.first_name,
        'change-first_name'],
      [
        'Last Name',
        res.locals.user.last_name || '- Empty -',
        'change-last_name'],
      [
        'Avatar',
        res.locals.user.avatar === '/images/avatar_example.png' ? '- Default -' : res.locals.user.avatar,
        'change-avatar'],
      [
        'User Info',
        res.locals.user.user_info || '- Empty -',
        'change-user_info'],
      [
        'Password',
        '********',
        'change-password'],
      [
        'Country',
        res.locals.user.country,
        'change-country']
    ]
    res.render('user-settings', { profile })
  }
)

router.get('/log_out',
  validateSession,
  function (req, res) {
    req.session.destroy(function () {
      res.redirect('/')
    })
  }
)

module.exports = router
