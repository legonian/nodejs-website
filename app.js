const app = require('express')()
const path = require('path')

const configSetup = require('./config_on_start')
const errorHandling = require('./error_handling')

const rootRoute = require('./routes/root-router')
const userRoute = require('./routes/users-router')
const postRoute = require('./routes/posts-router')
const messageRoute = require('./routes/messages-router')

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(configSetup)

app.use('/', rootRoute)
app.use('/u', userRoute)
app.use('/p', postRoute)
app.use('/m', messageRoute)

app.use(errorHandling)

module.exports = app
