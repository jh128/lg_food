const multer = require('multer')
const path = require('path')

// 此中间件响应添加职位和修改职位的请求
const fileupload = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      let fn = file.originalname
      let dot = fn.lastIndexOf('.')
      let filename = file.fieldname + '-' + Date.now() + fn.substr(dot)
      // 修改req对象的内容，以备中间件栈后边的中间件能读取到修改后的值
      req.filename = filename
      cb(null, filename)
    }
  })

  const fileFilter = (req, file, cb) => {
    if (['image/jpeg', 'image/gif', 'image/png'].indexOf(file.mimetype) != -1) {
      cb(null, true)
    } else {
      cb(new Error('图片格式不正确'))
    }
  }

  const upload = multer({ storage, fileFilter }).single('companyLogo')
  upload(req, res, function (err) {
    if (err) { // 传了但是没有传成功
      res.render('position', {ret: false, data: JSON.stringify({msg: err.message})})
    } else { // 没传或者传递成功了
      if (req.filename) {
        next()
      } else {
        // 如何判断在添加职位信息的时候，没有上传图片？
        // 可以通过判断req.body.id是否存在来实现
        if (req.body.id) {
          next()
        } else {
          res.render('position', {ret: false, data: JSON.stringify({msg: '必须选择图片'})})
        }
      }
    }
  })
}

module.exports = {
  fileupload
}
