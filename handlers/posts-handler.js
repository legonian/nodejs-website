const Post = require('../models/post-model')

exports.readPost = async function (req, res) {
  const postId = parseInt(req.params.postId)
  if (isNaN(postId)) {
    res.render('empty', { pageTitle: 'No such post' })
  } else {
    const postData = await Post.get('post_id', req.params.postId)
    res.render('post/single-post', { post: postData })
  }
}

exports.editPost = async function (req, res) {
  res.send('done')
}

exports.sendPostIdJson = async function (_req, res) {
  res.json({ post_id: res.locals.post_id })
}

exports.ok = async function (_req, res) {
  res.send('done')
}
