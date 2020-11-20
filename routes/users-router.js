const express = require('express')
const router = express.Router()

const User = require('../models/user-model')
const Post = require('../models/post-model')

const checkCaptcha = require('../middleware/check_captcha')
const validateSession = require('../middleware/validate-session-middleware')
const validateForm = require('../middleware/validate-form-middleware')
const authUser = require('../middleware/user-authorize-middleware')

router.get('/',
  validateSession,
  function (req, res) {
    const userURL = `/u/${req.session.user.user_id}`
    res.redirect(userURL)
  }
)

router.get('/:userId/posts', async function (req, res) {
  const postlist = await Post.getAll('user_id', req.params.userId)
  res.render('post-list', { postlist })
})

router.get('/:userId', async function (req, res, next) {
  const userId = parseInt(req.params.userId)
  const userData = await User.get('user_id', req.params.userId)
  if (userData && !isNaN(userId)) {
    res.render('user-page', { profile: userData })
  } else {
    req.session.error = 'No such user'
    next()
  }
})

router.post('/login',
  checkCaptcha,
  validateForm,
  authUser,
  async function (_req, res) {
    res.redirect('/u')
  }
)

router.post('/signup',
  checkCaptcha,
  validateForm,
  authUser,
  async function (_req, res) {
    res.redirect('/u')
  }
)

router.post('/update',
  validateSession,
  validateForm,
  async function (req, res, next) {
    req.body.username = req.session.user.username
    const changedUser = await User.change(req.body)
    if (changedUser) {
      req.session.user = changedUser
      res.send('done')
    } else {
      next()
    }
  }
)

router.post('/delete',
  validateSession,
  validateForm,
  async function (req, res, next) {
    req.body.username = req.session.user.username
    if(await User.delete(req.body)){
      req.session.destroy(function () {
        res.send('done')
      })
    } else {
      next()
    }
  }
)

module.exports = router
