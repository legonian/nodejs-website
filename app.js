const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const indexRouter = require('./routes/index')
const profileRouter = require('./routes/profile')

const app = express()

app.set('trust proxy', 1)

app.use(session({
  name: 'sid',
  secret: 'hatsthsththts',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // 1 hour
    sameSite: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }
}))

app.use(function(req, res, next){
  const err = req.session.error
  const msg = req.session.success
  delete req.session.error
  delete req.session.success
  res.locals.message = ''
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>'
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>'
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/profile', profileRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
