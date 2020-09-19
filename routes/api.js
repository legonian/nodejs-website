const express = require('express')
const multer  = require('multer')

const router = express.Router()
//const upload = multer({ dest: 'uploads/' })

router.get('/images/:id', function(req, res) {
  res.redirect('/')
})

router.post('/images/upload', /*upload.single('uploaded_file'), */function(req, res) {
  //console.log('req.file =', req.file)
  res.redirect('/')
})

module.exports = router