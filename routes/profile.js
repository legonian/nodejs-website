var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
  if (req.session.user)
    res.render('profile', {name: req.session.user.name, post: '123'})
  else
    res.send('Not signed. <a href="/">Click</a> to go to main page.')
})

module.exports = router