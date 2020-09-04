var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
  res.render('profile', {name: 'Name', post: '123'})
})

module.exports = router