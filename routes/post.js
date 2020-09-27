const express = require('express')
const router = express.Router()

const User = require('../models/user_model')
const changeUserParam = User.changeParameter
const validateSession = User.middleware.validateSession

const Post = require('../models/post_model')
const addPost = Post.add
const validatePost = Post.middleware.validate

router.post('/upload', validateSession, validatePost, async function(req, res) {
  req.session.user = await changeUserParam(req.body.user, 'posts_count', (postsCount)=> {
    return postsCount + 1
  })

  addPost(req.body)
  res.send('Uploaded! <a href="/">Go to Home Page</a> / <a href="/user/profile">Go to Profile</a>')
  //res.redirect('/')
})

router.get('/new', validateSession, function(req, res) {
  res.render('new_post')
})

module.exports = router