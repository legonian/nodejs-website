module.exports = async function ( req, res, next ) {
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

    if ( isOK ) {
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