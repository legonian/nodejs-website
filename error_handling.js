const createError = require('http-errors')

module.exports = [
  function (req, res, next) {
    const err = req.session.error
    const msg = req.session.success
    delete req.session.error
    delete req.session.success
    res.locals.message = ''
    if (err) res.locals.message = err
    if (msg) res.locals.message = msg
    next()
  }, // catch 404 and forward to error handler
  function (req, res, next) {
    next(createError(404))
  }, // error handler
  function (err, req, res, next) {
    // set locals, only providing error in development
    if (!res.locals.message) res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  }
]
