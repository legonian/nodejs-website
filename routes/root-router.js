const express = require('express')
const router = express.Router()

const validateSession = require('../middleware/validate-session-middleware')

const { root, newPost, signup, userList, settings, logOut } = require('../handlers/root-handler')

router.get('/', root)
router.get('/new_post', validateSession, newPost)
router.get('/signup_page', signup)
router.get('/userlist', userList)
router.get('/settings', validateSession, settings)
router.get('/log_out', logOut)

module.exports = router
