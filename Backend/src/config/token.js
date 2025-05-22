const jwt = require('jsonwebtoken')

const genToken = async(userId)=>{
  try {
    const token = await jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn:'30d'
    })
    return token
  } catch (error) {
    
    
  }
}

module.exports = {
  genToken
}