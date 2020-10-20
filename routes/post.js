const express = require('express')
const showdown = require('showdown')
const router = express.Router()
const converter = new showdown.Converter()

const User = require('../models/user_model')
const changeUserParam = User.changeParameter
const validateSession = User.middleware.validateSession

const Post = require('../models/post_model')
const addPost = Post.add
const getPostsBy = Post.getBy
const validatePost = Post.middleware.validate

router.get('/new', validateSession, function (_req, res) {
  res.render('post-new')
})

router.post('/upload',
  validateSession,
  validatePost,
  async function (req, res) {
    req.session.user = await changeUserParam(req.body.user, 'posts_count', (postsCount) => {
      return postsCount + 1
    })

    await addPost(req.body)
    res.send('Uploaded! <a href="/">Go to Home Page</a> / <a href="/user/">Go to Profile</a>')
  }
)

router.get('/:postId', async function (req, res, next) {
  const postId = parseInt(req.params.postId)
  if (isNaN(postId)) {
    next()
  } else {
    const postData = await getPostsBy('post_id', req.params.postId)
    postData.content = converter.makeHtml(postData.content)
    res.render('post-page', { post: postData })
  }
})

module.exports = router
