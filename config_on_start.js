const path = require('path')
const logger = require('morgan')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const compression = require('compression')

module.exports = [
  compression(),
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'",
        'https://maxcdn.bootstrapcdn.com/',
        'https://cdn.jsdelivr.net/',
        'https://fonts.gstatic.com/',
        'https://www.google.com/',
        'https://fonts.googleapis.com/',
        'https://loremipsum.io/',
        'https://i.imgur.com/'],
      'script-src': ["'self'",
        'https://www.google.com/',
        'https://www.gstatic.com/'
      ],
      'object-src': ["'none'"]
    }
  }),
  (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '-1')
    next()
  },
  session({
    store: new (require('connect-pg-simple')(session))({
      pool: require('./models/pool')
    }),
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
      sameSite: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  }),
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(),
  express.static(path.join(__dirname, 'public')),
  function (req, res, next) {
    if (req.session.user) {
      res.locals.user = req.session.user
    } else {
      res.locals.user = false
    }
    next()
  }
]
