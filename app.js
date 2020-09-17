const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const helmet = require('helmet')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const apiRouter = require('./routes/api')

const app = express()

app.set('trust proxy', 1)
app.use(helmet())

app.use(helmet.contentSecurityPolicy({ directives:{
  "default-src": ["'self'",
                  "https://fonts.gstatic.com/",
                  "https://www.google.com/",
                  "https://fonts.googleapis.com/"],
  "script-src": ["'self'", 
                 "https://www.google.com/",
                 "https://www.gstatic.com/",],
  "object-src": ["'none'"], 
}}))

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool : require('./models/pool'),
  }),
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 20*24*60*60*1000, // 20 days
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

app.locals.my_paths = {path_to_user_profile: '/user/profile',
                       path_to_user_settings: '/user/profile',
                       path_to_home_page: '/'}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api', apiRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)

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
