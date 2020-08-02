
const basicAuth = require('basic-auth')
const credentials = require('./credentials.json')

const REALM = 'Flowing'

module.exports = (req, res, next) => {
  const unauthorized = res => {
    res.set('WWW-Authenticate', 'Basic realm=' + REALM)
    return res.sendStatus(401)
  }

  var user = basicAuth(req)

  if (!user || !user.name || !user.pass) {
    return unauthorized(res)
  }

  if (user.name === credentials.user && user.pass === credentials.password) {
    return next()
  } else {
    return unauthorized(res)
  }
}
