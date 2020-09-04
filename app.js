const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.locals.post = 4513 + ' posts';
  res.render('profile', {name: 'Marques Brown'})
})


app.listen(3000)
