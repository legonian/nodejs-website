const User = require('../models/user-model')

exports.root = function (_req, res) {
  res.render('index')
}

exports.newPost = function (_req, res) {
  res.render('post/new-post')
}

exports.signup = function (req, res) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user-signup', { username: req.query.username })
  }
}

exports.userList = async function (_req, res) {
  const ul = await User.getAllUsers()
  res.render('user-list', { userlist: ul })
}

exports.settings = function (_req, res) {
  const profile = [
    [
      'Username',
      res.locals.user.username,
      'change-username'],
    [
      'Email address',
      res.locals.user.email,
      'change-email'],
    [
      'First Name',
      res.locals.user.first_name,
      'change-first_name'],
    [
      'Last Name',
      res.locals.user.last_name || '- Empty -',
      'change-last_name'],
    [
      'Avatar',
      res.locals.user.avatar === '/images/avatar_example.png' ? '- Default -' : res.locals.user.avatar,
      'change-avatar'],
    [
      'User Info',
      res.locals.user.user_info || '- Empty -',
      'change-user_info'],
    [
      'Password',
      '********',
      'change-password'],
    [
      'Country',
      res.locals.user.country,
      'change-country']
  ]
  res.render('user-settings', { profile })
}

exports.logOut = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/')
  })
}
