const mongoose = require('mongoose')
const connectdb = async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    
    
  } catch (error) {
    
  }
}

connectdb()