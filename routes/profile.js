var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
  if (req.session.user){
    if (req.session.user){
      res.locals.user = req.session.user
    } else {
      res.locals.user = false
    }
    res.render('profile')
  }
  else{
    res.send('Not signed. <a href="/">Click</a> to go to main page.')
  }
})

module.exports = router