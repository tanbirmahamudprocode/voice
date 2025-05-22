import React from 'react'
import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { motion } from 'framer-motion'

function Card({image}) {
  const {
    userData,
    setUserData,
    frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage
  } = useContext(UserDataContext);

  return (
    <motion.div
      className={`card w-[110px] h-[180px] lg:w-[170px] lg:h-[280px] cursor-pointer
      relative group ${selectedImage === image ? "animate-glow border-[#00d0ff]" : ""}`}
      onClick={() => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#00000099] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span className="text-white text-sm font-medium">Select</span>
      </div>
      <img
        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        src={image}
        alt="Assistant avatar"
      />
      {selectedImage === image && (
        <motion.div
          className="absolute top-2 right-2 bg-[#00d0ff] rounded-full p-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Card