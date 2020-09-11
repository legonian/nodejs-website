const express = require('express')
const router = express.Router()
const User = require('../models/user')
const https = require('https')
const querystring = require('querystring')

function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
}

function captchaAPI(captcha_res){
  return new Promise((resolve, reject) => {
    const data = querystring.stringify({
      secret: process.env.RECAPTCHA_SECRET,
      response: captcha_res
    })

    const options = {
      hostname: 'google.com',
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
      },
    }

    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => {
        responseBody += chunk
      })

      res.on('end', () => {
        resolve(JSON.parse(responseBody))
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

router.get('/', function(req, res, next) {
  let top_topics = [
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  }
  ]
  
  if (req.session.user){
    res.locals.nickname = req.session.user.nickname
  }
  else{
    res.locals.nickname = false
  }
  
  res.render('index', {topics: JSON.stringify(top_topics)});
})

router.post('/login', async function(req, res) {
  console.log('req.body[g-recaptcha-response] =', req.body['g-recaptcha-response'])

  const captcha_res = req.body['g-recaptcha-response']

  const api_res = await captchaAPI(captcha_res)

  console.log('api_res =', api_res)

  const temp_user = new User({name: req.body.username, pass: req.body.password})
  const db_user = await temp_user.auth()

  if(db_user){
    req.session.regenerate(function(){
      req.session.user = db_user
      req.session.success = 'Authenticated as ' + db_user.nickname
      res.redirect('/profile')
    })
  }
  else{
    req.session.error = 'Authentication failed, please check your '
      + ' username and password.'
    res.redirect('/')
  }
})

router.post('/signup', async function(req, res) {
  const temp_user = new User({name: req.body.username, 
                              pass: req.body.password, 
                              first_name: req.body.first_name})
  const db_user = await temp_user.sign_up()
  if(db_user){
    req.session.regenerate(function(){
        req.session.user = db_user
        req.session.success = 'Authenticated as ' + db_user.nickname
        res.redirect('/profile')
      })
  }else{
    res.redirect('/')
  }
})

router.get('/log_out', function(req, res, next) {
  req.session.destroy(function(){
    res.redirect('/')
  })
})


module.exports = router;