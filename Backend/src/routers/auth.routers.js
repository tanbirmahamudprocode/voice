const express = require('express')
const authRouter = express.Router()
const { singup, login, logOut } = require('../controllers/auth.controller')


//router handlera

authRouter.post('/singup',singup)
authRouter.post('/login',login)
authRouter.get('/logout',logOut)



module.exports = authRouter
