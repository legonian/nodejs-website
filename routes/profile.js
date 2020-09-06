var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
  if (req.session.user){
    res.locals.name = req.session.user.name
    res.locals.post = '123'
    res.render('profile')
  }
  else{
    res.locals.name = false
    res.send('Not signed. <a href="/">Click</a> to go to main page.')
  }
})

module.exports = router