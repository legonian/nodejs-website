const express = require('express')
const router = express.Router()

function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
}

router.get('/', function(req, res) {
  res.locals.topics = JSON.stringify([
    { suptitle : "Some very important topic1", subtitle : "Foobar, foobar, foobar, foobar, foobar, foobar, foobar.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Some very important topic2", subtitle : "Foobar, foobar, foobar, foobar, foobar, foobar, foobar.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Some very important topic3", subtitle : "Foobar, foobar, foobar, foobar, foobar, foobar, foobar.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Some very important topic4", subtitle : "Foobar, foobar, foobar, foobar, foobar, foobar, foobar.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Some very important topic5", subtitle : "Foobar, foobar, foobar, foobar, foobar, foobar, foobar.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  }
  ])
  
  res.render('index')
})

module.exports = router