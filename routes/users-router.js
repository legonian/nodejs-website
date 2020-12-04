const express = require('express')
const router = express.Router()

const rateLimiter = require('../middleware/rate-limiter')
const checkCaptcha = require('../middleware/check_captcha')
const validateSession = require('../middleware/validate-session-middleware')
const validateForm = require('../middleware/validate-form-middleware')
const authUser = require('../middleware/user-authorize-middleware')
const changeUser = require('../middleware/user-change-middleware')
const deleteUser = require('../middleware/user-delete-middleware')

const { yourProfile, userProfile, userPosts, ok } = require('../handlers/users-handler')

router.get('/', validateSession, yourProfile)
router.get('/:userId/posts', userPosts)
router.get('/:userId', userProfile)
router.post('/login', rateLimiter, checkCaptcha, validateForm, authUser, ok)
router.post('/signup', rateLimiter, checkCaptcha, validateForm, authUser, ok)
router.post('/update', validateSession, validateForm, changeUser, ok)
router.post('/delete', validateSession, validateForm, deleteUser, ok)

module.exports = router
