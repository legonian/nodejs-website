var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forum', { header: 'Header Name', name: 'test' });
});

module.exports = router;
