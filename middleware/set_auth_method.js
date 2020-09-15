module.exports = function (option) {
  return function (req, res, next) {
    req.userAuthMethod = option
    next()
  }
}