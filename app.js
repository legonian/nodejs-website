const app = require('express')()
const path = require('path')

const configSetup = require('./config_on_start')
const errorHandling = require('./error_handling')

const apiRoute = require('./routes/api')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

function indexRoute(req, res) {
  res.render('index')
}

app.use(configSetup)

app.get('/', indexRoute)
app.use('/api', apiRoute)
app.use('/user', userRoute)
app.use('/post', postRoute)

app.use(errorHandling)

module.exports = app
