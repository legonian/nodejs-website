const Post = require('../models/post-model')

exports.uploadPost = async function (req, res, next) {
  req.body.user = req.session.user
  req.body.meta_title = req.body.content.slice(0, 100)
  const postData = await Post.create(req.body)
  if (postData) {
    res.locals.post_id = postData.post_id
    next()
  } else {
    req.session.error = 'Title must be unique'
    next('route')
  }
}

exports.changePost = async function (req, res, next) {
  next()
}

exports.deletePost = async function (req, res, next) {
  next()
}
