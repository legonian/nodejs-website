const express = require('express')
const router = express.Router()

const Post = require('../models/post-model')

const validateSession = require('../middleware/validate-session-middleware')
const validateForm = require('../middleware/validate-form-middleware')

router.get('/:postId', async function (req, res, next) {
  const postId = parseInt(req.params.postId)
  if (isNaN(postId)) {
    next()
  } else {
    const postData = await Post.get('post_id', req.params.postId)
    res.render('post-page', { post: postData })
  }
})

router.get('/:postId/edit', async function (req, res) {
})

router.post('/upload',
  validateSession,
  validateForm,
  async function (req, res, next) {
    req.body.user = req.session.user
    const postData = await Post.create(req.body)
    if (postData){
      res.send('Uploaded! <a href="/">Go to Home Page</a> / <a href="/u">Go to Profile</a>')
    } else {
      req.session.error = 'Title must be unique'
      next('route')
    }
  }
)

router.post('/update', async function (req, res) {
})

router.post('/delete', async function (req, res) {
})

module.exports = router
