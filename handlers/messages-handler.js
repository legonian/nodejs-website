const Message = require('../models/message-model')

exports.messages = function (_req, res) {
  res.render('user-messages')
}

exports.allMessagesJson = async function (req, res) {
  const chat = await Message.getChat(req.session.user.user_id)
  if (chat) {
    res.json({ ok: true, user: req.session.user, chat })
  } else {
    res.json({ ok: false })
  }
}

exports.sendAndReturnJson = async function (req, res) {
  req.body.sent_from = req.session.user.user_id
  res.json(await Message.create(req.body))
}
