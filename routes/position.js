const express = require('express')
const router = express.Router()

const posController = require('../controllers/position.controller')

const fileuploadMiddleware = require('../middlewares/fileupload')
const authMiddleware = require('../middlewares/authenticate')

router.route('/')
  .post(fileuploadMiddleware.fileupload, posController.save)
  // .get(posController.findAll)
  .get(authMiddleware, posController.find)
  .delete(posController.remove)

router.route('/:id')
  .get(posController.findById)

router.route('/update')
  .post(fileuploadMiddleware.fileupload, posController.update)

router.route('/search')
  .post(posController.findByKeywords)

router.route('/m/list')
  .get(posController.find)

module.exports = router
