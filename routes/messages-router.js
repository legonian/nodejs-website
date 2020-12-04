const express = require('express')
const router = express.Router()

const validateSession = require('../middleware/validate-session-middleware')
const validateForm = require('../middleware/validate-form-middleware')

const { messages, allMessagesJson, sendAndReturnJson } = require('../handlers/messages-handler')

router.get('/', validateSession, messages)
router.post('/get_chat', validateSession, allMessagesJson)
router.post('/send', validateSession, validateForm, sendAndReturnJson)

module.exports = router
