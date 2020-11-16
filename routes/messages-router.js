const express = require('express')
const router = express.Router()

const Message = require('../models/message-model')
const validateSession = require('../middleware/validate-session-middleware')
// const validateForm = require('../middleware/validate-form-middleware')

router.get('/',
  validateSession,
  function (_req, res) {
    res.render('user-messages')
  }
)

router.post('/get_chat', async function (req, res) {
  const chat = await Message.getChat(req.session.user.user_id)
  if (chat){
    res.json({ ok: true, user: req.session.user, chat })
  } else {
    res.json({ ok: false })
  }
})

router.post('/upload', async function (req, res) {
  const newMessage = await Message.create(req.body)
  res.json(newMessage)
})

module.exports = router
