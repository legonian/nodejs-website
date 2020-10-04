const express = require('express')
const router = express.Router()

const User = require('../models/user_model')

router.get('/userlist', async function (req, res) {
  const ul = await User.getList()
  res.json(ul)
})

router.post('/images/upload', function (req, res) {
  res.redirect('/')
})

module.exports = router
