const mongoose = require('mongoose')
const connectdb = async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Connected to MongoDB')
    
    
  } catch (error) {
    console.log('MongoDB connection error',error)
    
  }
}

connectdb()