const express = require('express')
const router = express.Router()
const User = require('../models/user')
const https = require('https')
const querystring = require('querystring')

const check_captcha = require('../middleware/check_captcha')

const user_login = require('../middleware/login')
const user_signup = require('../middleware/signup')

function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
}

router.get('/', function(req, res) {
  let top_topics = [
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  }
  ]

  res.locals.nickname = req.session.user ? req.session.user.nickname : false
  
  res.render('index', {topics: JSON.stringify(top_topics)});
})

router.post('/login', check_captcha, user_login, async function(req, res) {
  if (req.session.user) {
    res.redirect('/profile')
  }
  else {
    res.redirect('/')
  }
})

router.post('/signup', check_captcha, user_signup, async function(req, res) {
  if (req.session.user) {
    res.redirect('/profile')
  }
  else {
    res.redirect('/')
  }
})

router.get('/log_out', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/')
  })
})

module.exports = router;