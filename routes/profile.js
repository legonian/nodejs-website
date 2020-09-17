var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
  if (res.locals.user){
    res.render('profile')
  }
  else{
    res.send('Not signed. <a href="/">Click</a> to go to main page.')
  }
})

module.exports = router