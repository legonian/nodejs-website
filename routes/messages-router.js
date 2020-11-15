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

router.post('/',
  async function (req, res) {
    const chat = await Message.getChat(req.session.user.user_id)
    res.json(chat)
  }
)

router.post('/upload',
  // validateForm,
  async function (req, res) {
    // obj.sent_from
    // obj.sent_to
    // obj.content
    const newMessage = await Message.create(req.body)
    res.json(newMessage)
  }
)

module.exports = router
