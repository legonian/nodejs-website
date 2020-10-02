const express = require('express')
const path = require('path')
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, 'public')))
/*---------------------------------------------------------------------------*/

// Models of Data:

// Main User
app.locals.user = {
    user_id: 1,
    username: 'Username1',
    first_name: 'FirstName1',
    rating: 420,
    avatar: '',
    user_info: 'Some intro info about user1',
    posts_count: 1337,
    create_date: new Date(2000, 1, 30, 4, 55, 0),
    country: 'Oz'
}
// User for displaying profile in '/user/:id' (like '/user/123')
app.locals.profile = {
    user_id: 2,
    username: 'Username2',
    first_name: 'FirstName2',
    rating: 456,
    avatar: '',
    user_info: 'Some intro info about user2',
    posts_count: 7777,
    create_date: new Date(2003, 1, 30, 4, 55, 0),
    country: 'Zo'
}
// Post data to Display
app.locals.post = {
    post_id: 13,
    user: app.locals.user,
    title: "Title",
    meta_title: "meta_title",
    rating: 123,
    create_date: new Date(2001, 1, 30, 4, 55, 0),
    update_date: new Date(2002, 1, 30, 4, 55, 0),
    content: "Content of Post"
}
// Array of posts ('/user/:id/posts')
app.locals.postlist = [
    Object.assign(app.locals.user, app.locals.post),
    Object.assign(app.locals.user, app.locals.post),
    Object.assign(app.locals.user, app.locals.post),
]
// Data to fill Message Page
app.locals.massage_page = {
    user: app.locals.user,
    userlist:[ // list of conversations with users
      {
        user: app.locals.profile, // user to text with
        massage_list:[
          {
            user: app.locals.user, // from who 
            text: "message"
          }
        ]
      }
    ]
}

/*---------------------------------------------------------------------------*/

// Main Route:
app.get('/', function(req, res) {
    res.render('index')
})

// User Routes:
app.get('/user/profile', function(req, res) {
    res.render('profile', {profile: app.locals.user})
})
app.get('/user/list', function(req, res) {
    res.render('users_list', {userlist: [app.locals.user, app.locals.profile]})
})
app.get('/user/messages', function(req, res) {
    res.render('messages')
})
app.get('/user/settings', function(req, res) {
    res.render('settings')
})
app.get('/user/:userId', function(req, res) {
    res.render('profile')
})

// Post Routes:
app.get('/post/new', function(req, res) {
    res.render('new_post')
})
app.get('/post/:postId', function(req, res) {
    res.render('post')
})
app.get('/user/:userId/posts', function(req, res) {
    res.render('post_list')
})

/*---------------------------------------------------------------------------*/
app.use(function(req, res, next) {
  next(createError(404))
})
app.use(function(err, req, res, next) {
    if ( !res.locals.message ) res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})
app.listen(3000)