const express = require('express')
const app = express()
const authRouter = require('./routers/auth.routers')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRouter = require('./routers/user.routers')
const { geminiRespont } = require('../gamini')

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))


//ROUTES




app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)




//export app
module.exports = app
