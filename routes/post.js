const express = require('express')
const router = express.Router()

const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const User = require('../models/user_model')
const changeUserParam = User.changeParameter
const validateSession = User.middleware.validateSession

const Post = require('../models/post_model')
const addPost = Post.add
const getPostsBy = Post.getBy
const validatePost = Post.middleware.validate

router.get('/new', validateSession, function (req, res) {
  res.render('new_post')
})

router.post('/upload',
  validateSession,
  validatePost,
  async function (req, res) {
    req.session.user = await changeUserParam(req.body.user, 'posts_count', (postsCount) => {
      return postsCount + 1
    })

    await addPost(req.body)
    res.send('Uploaded! <a href="/">Go to Home Page</a> / <a href="/user/profile">Go to Profile</a>')
  }
)

router.get('/:postId', async function (req, res, next) {
  const postId = parseInt(req.params.postId)
  if (isNaN(postId)) {
    next()
  } else {
    const postData = await getPostsBy('post_id', req.params.postId)
    postData.content = dompurify.sanitize(marked(postData.content))
    res.render('post', { post: postData })
  }
})

module.exports = router
