const express = require('express')
const router = express.Router()

router.post('/upload', async function(req, res) {
  res.redirect('/')
})

router.get('/new', function(req, res) {
  res.redirect('/')
})

module.exports = router