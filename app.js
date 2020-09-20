const app = require('express')()
const path = require('path')
const configOnStart = require('./config_on_start')
const errorHandling = require('./error_handling')

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(configOnStart)

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '-1')
  
  next()
})

app.use('/', require('./routes/index'))
app.use('/api', require('./routes/api'))
app.use('/user', require('./routes/user'))
app.use('/post', require('./routes/post'))

app.use(errorHandling)

module.exports = app