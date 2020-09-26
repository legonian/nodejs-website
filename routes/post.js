const express = require('express')
const router = express.Router()
const DB = require('../models/db')

const validateSession = require('../middleware/validate_session')
const validatePost = require('../middleware/validate_post')

router.post('/upload', validateSession, validatePost, async function(req, res) {
  req.session.user = await DB.user.changeParameter(req.body.user, 'posts_count', (postsCount)=> {
    return postsCount + 1
  })
  DB.post.add(req.body)
  res.send('Uploaded! <a href="/">Go to Home Page</a> / <a href="/user/profile">Go to Profile</a>')
  //res.redirect('/')
})

router.get('/new', validateSession, function(req, res) {
  res.render('new_post')
})

module.exports = router