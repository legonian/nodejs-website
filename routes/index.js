const express = require('express')
const router = express.Router()
const User = require('../models/user')

function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
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
  console.log('req.body =', req.body)
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