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

router.post('/login',
  checkCaptcha,
  validateUser,
  authUser,
  async function (_req, res) {
    res.redirect('/user')
  }
)

router.post('/signup',
  checkCaptcha,
  validateUser,
  authUser,
  async function (_req, res) {
    res.redirect('/user')
  }
)

router.get('/log_out',
  function (req, res) {
    req.session.destroy(function () {
      res.redirect('/')
    })
  }
)

router.get('/',
  validateSession,
  function (req, res) {
    const userURL = `/user/${req.session.user.user_id}`
    res.redirect(userURL)
  }
)

router.get('/posts',
  validateSession,
  function (req, res) {
    const userURL = `/user/${req.session.user.user_id}/posts`
    res.redirect(userURL)
  }
)

router.get('/messages',
  validateSession,
  function (_req, res) {
    res.render('user-messages')
  }
)

router.get('/settings',
  validateSession,
  function (_req, res) {
    res.render('user-settings')
  }
)

router.get('/list', async function (_req, res) {
  const ul = await getUserList()
  res.render('user-list', { userlist: ul })
})

router.get('/:userId/posts', async function (req, res) {
  const pl = await getPostsBy('user_id', req.params.userId)
  res.render('post-list', { postlist: Array.isArray(pl) ? pl : [pl] })
})

router.get('/:userId', async function (req, res, next) {
  const userId = parseInt(req.params.userId)
  const userData = await getUserBy('user_id', req.params.userId)
  if (userData && !isNaN(userId)) {
    res.render('user-page', { profile: userData })
  } else {
    req.session.error = 'No such user'
    next()
  }
})

router.get('/signup_page',
  function (req, res) {
    if (req.session.user) {
      res.redirect('/')
    } else {
      res.render('user-signup', { username: req.query.username})
    }
  }
)

module.exports = router
