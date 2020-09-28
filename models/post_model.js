const { makeQuery } = require('./db')
const userModel = require('./user_model')

Post = {}
Post.getBy = async function (param, value){
  const query = `SELECT * FROM posts WHERE ${param} = $1`
  return await makeQuery(query, [value], async dbRes =>{
    if (typeof dbRes === 'undefined' || dbRes.length === 0){
      return false
    } else { return dbRes }
  })
}
Post.add = async function (obj){
  const query = `INSERT INTO posts(user_id,
                                   title,
                                   meta_title,
                                   content)
  VALUES ($1, $2, $3, $4)`
  const vars_arr = [obj.user.user_id,
                    obj.title,
                    obj.meta_title,
                    obj.content]
  await makeQuery(query, vars_arr)
  userModel.changeParameter(obj.user, 'posts_count', (parameter)=> {
  return parameter + 1
  })
  return await Post.getBy('title', obj.title)
}

Post.middleware = {}
Post.middleware.validate = async function ( req, res, next ) {
  
  try {
    bodyKeys = Object.keys(req.body).sort()
    let isOK = (bodyKeys.length == 2) && bodyKeys.every(function(element, index) {
      return element === [ 'content', 'title' ][index]
    })

    isOK = isOK &&
           typeof req.body.title === 'string' &&
           0 < req.body.title.length
    isOK = isOK &&
           typeof req.body.content === 'string' &&
           0 < req.body.content.length

    if ( isOK && await Post.getBy('title', req.body.title)){
      req.session.error = 'Title must be unique'
      next('route')
    } else if ( isOK ) {
      req.body.user = req.session.user
      req.body.title = req.body.title.slice(0, 80)
      req.body.meta_title = req.body.content.slice(0, 100)
      next()
    } else {
      req.session.error = 'Wrong post data!'
      next('route')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = Post