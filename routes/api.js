const express = require('express')
const router = express.Router()

const User = require('../models/user_model')

router.post('/images/upload', function (_req, res) {
  res.redirect('/')
})

module.exports = router
