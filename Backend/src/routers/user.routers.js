const express = require('express')
const userRouter = express.Router()
const { getCurrentUser, updateAssistant,asktoassistant } = require('../controllers/user.controller')
const { isAuth } = require('../middleware/isAuth')
const { upload } = require('../middleware/multer')



//router handlera

userRouter.get('/current',isAuth,getCurrentUser)
userRouter.post('/updata',isAuth,upload.single('assistantImage'),updateAssistant)
userRouter.post('/asktoassistant',isAuth,asktoassistant)


module.exports = userRouter