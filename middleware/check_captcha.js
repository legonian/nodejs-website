const https = require('https')
const querystring = require('querystring')

function captchaAPI(captcha_res){
  return new Promise((resolve, reject) => {
    const data = querystring.stringify({
      secret: process.env.RECAPTCHA_SECRET,
      response: captcha_res
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

function check_captcha(){
  return async function (req, res, next) {
    try {
      const captcha_res = req.body['g-recaptcha-response']
      const api_res = captcha_res && await captchaAPI(captcha_res)
      req.captcha = api_res && api_res.success
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = check_captcha()