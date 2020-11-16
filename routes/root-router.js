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
    res.render('post-new')
})

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
    res.render('user-settings')
  }
)

router.get('/log_out',
  function (req, res) {
    req.session.destroy(function () {
      res.redirect('/')
    })
  }
)

module.exports = router
