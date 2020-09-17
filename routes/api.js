const express = require('express')
const router = express.Router()

router.get('/images/:id', function(req, res) {
  res.redirect('/')
})

module.exports = router