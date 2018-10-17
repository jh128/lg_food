const userModel = require('../models/user.model')
const toolsUtil = require('../utils/tools.util')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')

const isSignin = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  let username = req.username
  res.render('user', {
    ret: true,
    data: JSON.stringify({
      username
    })
  })
}

const signup = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  let {username, password} = req.body
  let result = await userModel.findOne({username})
  if (result) {
    res.render('user', {
      ret: false,
      data: JSON.stringify('用户已存在！')
    })
  } else {
    req.body.password = await toolsUtil.crypt(password)
    let result = await userModel.save(req.body)
    let data = result ? {
      ret: true,
      data: JSON.stringify('注册成功~')
    } : {
      ret: false,
      data: JSON.stringify('注册失败！')
    }
    res.render('user', data)
  }
}

const signin = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  let {username, password} = req.body
  let result = await userModel.findOne({username})
  if (result) {
    let compareResult = await toolsUtil.compare({
      hash_password: result.password,
      password
    })
    if (compareResult) {
      let username = result.username
      let token = genToken({
        username
      })
      res.render('user', {
        ret: true,
        data: JSON.stringify({
          username,
          token
        })
      })
    } else {
      res.render('user', {
        ret: false,
        data: JSON.stringify('密码错误！')
      })
    }
  } else {
    res.render('user', {
      ret: false,
      data: JSON.stringify('用户名输入错误！')
    })
  }
}

function genToken(payload) {
  var cert = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'))
  const token = jwt.sign(payload, cert, {
    algorithm: 'RS256',
    expiresIn: '24h'
  })
  return token
}

module.exports = {
  signup,
  signin,
  isSignin
}
