const express = require('express')
const router = express.Router()

const validateSession = require('../middleware/validate-session-middleware')
const validateForm = require('../middleware/validate-form-middleware')
const { uploadPost, changePost, deletePost } = require('../middleware/post-middleware')

const { readPost, editPost, sendPostIdJson, ok } = require('../handlers/posts-handler')

router.get('/:postId', readPost)
router.get('/:postId/edit', editPost)
router.post('/upload', validateSession, validateForm, uploadPost, sendPostIdJson)
router.post('/update_post', changePost, ok)
router.post('/delete_post', deletePost, ok)

module.exports = router
