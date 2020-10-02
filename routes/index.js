const express = require('express')
const router = express.Router()

function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
}

router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router