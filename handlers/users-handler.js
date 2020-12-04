const User = require('../models/user-model')
const Post = require('../models/post-model')

exports.yourProfile = function (req, res) {
  const userURL = `/u/${req.session.user.user_id}`
  res.redirect(userURL)
}

exports.userProfile = async function (req, res) {
  const userId = parseInt(req.params.userId)
  const userData = await User.get('user_id', req.params.userId)
  if (userData && !isNaN(userId)) {
    res.render('user-page', { profile: userData })
  } else {
    res.render('empty', { pageTitle: 'No such user' })
  }
}

exports.userPosts = async function (req, res) {
  const postlist = await Post.getAll('user_id', req.params.userId)
  res.render('post/list-of-posts', { postlist })
}

exports.ok = async function (_req, res) {
  res.send('done')
}
