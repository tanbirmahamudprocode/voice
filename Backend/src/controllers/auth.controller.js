const userModel = require('../module/user.module')
const bcrypt = require('bcrypt')
const { genToken } = require('../config/token')



const singup = async (req,res)=>{
  try {
    const {name,email,password} = req.body
    const emailExit = await userModel.findOne({email})
    if(emailExit){
      return res.status(400).json({message:"Email already exists"})
    }
    if(password.length < 6){
      return res.status(400).json({message:"Password must be at least 6 characters"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const user = await userModel.create({
      name,
      email,
      password:hashedPassword
    })
    const token = await genToken(user._id)
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:1000*60*60*24*30,
      sameSite:"none",
      secure:true


    })
    return res.status(201).json({message:"User created",user})
  
    
  } catch (error) {
    return res.status(500).json({message:`singup error ${error}`})
    
    
  }
}
const login = async (req,res)=>{
  try {
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(400).json({message:"Email does not exists"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({message:"Invalid password"})
    }
 
 
    const token = await genToken(user._id)
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:1000*60*60*24*30,
      sameSite:"strict",
      secure:false


    })
    return res.status(200).json({
      message:"Login successful",
      user
    })
  
    
  } catch (error) {
    return res.status(500).json({message:`login error ${error}`})
    
    
  }
}


const logOut = async(req,res)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"Logout successful"})
    
  } catch (error) {
    return res.status(500).json({message:`logout error ${error}`})
    
  }

}


//exports
module.exports = {
  singup,
  login,
  logOut
}