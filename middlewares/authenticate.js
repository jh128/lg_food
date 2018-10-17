const path = require('path')
const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  let token = req.header('X-Access-Token')
  let cert = fs.readFileSync(path.resolve(__dirname, '../keys/public.key')) // get public key
  jwt.verify(token, cert, function(err, decoded) {
    if (err) {
      res.render('user', {
        ret: false,
        data: JSON.stringify('用户认证失败！')
      })
    } else {
      req.username = decoded.username
      next()
    }
  });
}
