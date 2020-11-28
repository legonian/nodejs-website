const express = require('express')
const app = express()
const path = require('path')

const configSetup = require('./middleware/app-config')
const errorHandling = require('./middleware/app-error')

const rootRoute = require('./routes/root-router')
const userRoute = require('./routes/users-router')
const postRoute = require('./routes/posts-router')
const messageRoute = require('./routes/messages-router')

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.locals.ipList = []

app.use(configSetup)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', rootRoute)
app.use('/u', userRoute)
app.use('/p', postRoute)
app.use('/m', messageRoute)

app.use(errorHandling)

module.exports = app
