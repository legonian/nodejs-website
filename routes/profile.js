var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
  if (req.session.user){
    res.locals.nickname = req.session.user.nickname
    res.locals.first_name = req.session.user.first_name
    res.locals.post = req.session.user.posts_count
    res.locals.country = req.session.user.country
    res.render('profile')
  }
  else{
    res.locals.nickname = false
    res.send('Not signed. <a href="/">Click</a> to go to main page.')
  }
})

module.exports = router