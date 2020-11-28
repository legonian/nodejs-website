// count requests from past 2 minutes
const limitPeriod = 2 * 60 * 1000

// 20 request per IP at given limitPeriod
const limitReqNum = 20

function checkIp (ipDates) {
  const nowTime = Date.now()
  for (let i = 0; i < ipDates.length; i++) {
    if (limitPeriod < nowTime - ipDates[i]) {
      ipDates.splice(i, 1)
      i--
    }
  }
  return ipDates.length < limitReqNum
}

module.exports = async function (req, _res, next) {
  if (typeof req.app.locals.ipList[req.ip] === 'undefined') {
    req.app.locals.ipList[req.ip] = [Date.now()]
    console.log('req.app.locals.ipList =', req.app.locals.ipList)
    next()
  } else if (checkIp(req.app.locals.ipList[req.ip])) {
    req.app.locals.ipList[req.ip].push(Date.now())
    console.log('req.app.locals.ipList =', req.app.locals.ipList)
    next()
  } else {
    req.session.error = 'Blocked for spam. Please try later.'
    console.log('req.app.locals.ipList =', req.app.locals.ipList)
    next('route')
  }
}
