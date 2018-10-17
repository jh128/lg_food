const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/authenticate')

router.post('/signup', userController.signup)

router.post('/signin', userController.signin)

router.post('/issignin', authMiddleware, userController.isSignin)

module.exports = router;
