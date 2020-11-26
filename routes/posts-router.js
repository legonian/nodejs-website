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
    res.render('post/single-post', { post: postData })
  }
})

router.get('/:postId/edit', async function (req, res) {
})

router.post('/upload',
  validateSession,
  validateForm,
  async function (req, res, next) {
    req.body.user = req.session.user
    req.body.meta_title = req.body.content.slice(0, 100)
    const postData = await Post.create(req.body)
    if (postData) {
      res.json({ post_id: postData.post_id })
    } else {
      req.session.error = 'Title must be unique'
      next('route')
    }
  }
)

router.post('/update_post', async function (req, res) {
})

router.post('/delete_post', async function (req, res) {
})

module.exports = router
