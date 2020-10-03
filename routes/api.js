const express = require('express')
const router = express.Router()

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
// upload.single('uploaded_file')

router.get('/images/:id', function (req, res) {
  res.redirect('/')
})

router.post('/images/upload', function (req, res) {
  // console.log('req.file =', req.file)
  res.redirect('/')
})

module.exports = router
