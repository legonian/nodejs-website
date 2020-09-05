var express = require('express');
var router = express.Router();

function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
}

let users = {user1: {name: '111', pass: '123123123'},
             user2: {name: '222', pass: '456456456'},
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
  res.render('index', {topics: JSON.stringify(top_topics)});
})

function authenticate(name, pass, fn) {
  console.log('authenticating %s:%s', name, pass)
  let user = users[name]
  if (!user) return fn(false)
  if (pass === user.pass) return fn(user)
  fn(false)
}

router.post('/login', function(req, res) {
  authenticate(req.body.username, req.body.password, function(user){
    console.log('User = ', user)
    if(user){
      req.session.regenerate(function(){
        req.session.user = user
        req.session.success = 'Authenticated as ' + user.name
        res.redirect('/profile')
      })
    }
    else{
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
      res.redirect('/')
    }
  })
  //res.redirect('/')
})

module.exports = router;