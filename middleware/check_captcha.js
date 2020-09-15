const https = require('https')
const querystring = require('querystring')

function captchaAPI(captchaRes){
  return new Promise((resolve, reject) => {
    const data = querystring.stringify({
      secret: process.env.RECAPTCHA_SECRET,
      response: captchaRes
    })

    const options = {
      hostname: 'google.com',
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
      },
    }

    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => {
        responseBody += chunk
      })

      res.on('end', () => {
        resolve(JSON.parse(responseBody))
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

module.exports = async function (req, res, next) {
    try {
      const captchaRes = req.body['g-recaptcha-response']
      const apiRes = captchaRes && await captchaAPI(captchaRes)
      if ( process.env.NODE_ENV === 'production' ) {
        req.captcha = apiRes && apiRes.success
      } else {
        req.captcha = false
      }
      next()
    } catch (error) {
      next(error)
    }
  }