const path = require('path')
const logger = require('morgan')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const compression = require('compression')

const dbSessionStore = require('connect-pg-simple')

const dbPool = require('./models/pool')

module.exports = [
  compression(),
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': [
        "'self'",
        "https://www.google.com/"
      ],
      'script-src': [
        "'self'",
        "https://www.google.com/recaptcha/api.js",
        "https://www.gstatic.com/recaptcha/"
      ],
      'object-src': [
        "'none'"
      ],
      'img-src': [
        "'self'",
        'https: data:'
      ]
    }
  }),
  function (_req, res, next) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '-1')
    next()
  },
  session({
    store: new (dbSessionStore(session))({
      pool: dbPool
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
  express.json({ limit: '5kb' }),
  express.urlencoded({ extended: true, limit: "5kb" }),
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
