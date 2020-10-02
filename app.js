const app = require('express')()
const path = require('path')

const configOnStart = require('./config_on_start')
const errorHandling = require('./error_handling')

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(configOnStart)

app.get('/', function(req, res) { res.render('index') })
app.use('/api', require('./routes/api'))
app.use('/user', require('./routes/user'))
app.use('/post', require('./routes/post'))

app.use(errorHandling)

module.exports = app