const express = require('express')
const router = express.Router()

router.post('/images/upload', function (_req, res) {
  res.redirect('/')
})

module.exports = router
