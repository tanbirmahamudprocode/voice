import React from "react";
import Card from "../components/Card";
import { RiImageAddFill } from "react-icons/ri";
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { UserDataContext } from "../context/UserContext";

function Coustomize() {
  const navigate = useNavigate();
  const {
    userData,
    frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage
  } = useContext(UserDataContext);

  const inputImage = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-b from-[#080818] via-[#0f0f2d] to-[#171757] flex justify-center items-center flex-col relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#6c63ff] filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] rounded-full bg-[#00d0ff] filter blur-[150px] opacity-20"></div>
      </div>

      <motion.button
        className="absolute top-5 left-5 flex items-center space-x-2 text-white bg-[#ffffff10] backdrop-blur-md rounded-full py-2 px-4 hover:bg-[#ffffff20] transition-all duration-300"
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoArrowBackOutline className="text-[#00d0ff]" />
        <span>Back</span>
      </motion.button>

      <motion.div
        className="z-10 w-full max-w-6xl px-4 py-10 flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-2 text-center mt-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d0ff] to-[#6c63ff]">Assistant</span>
        </motion.h1>

        <motion.p
          className="text-[#ffffff80] text-center max-w-md mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Choose an avatar for your voice assistant or upload your own image
        </motion.p>

        <motion.div
          className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 p-4"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <Card image={"/image1.jpeg"} />
          <Card image={"/image2.jpeg"} />
          <Card image={"/image3.jpeg"} />
          <Card image={"/image4.jpeg"} />
          <Card image={"/image5.jpeg"} />
          <Card image={"/image6.jpeg"} />
          <Card image={"/image7.jpeg"} />

          <motion.div
            className={`card w-[110px] h-[180px] lg:w-[170px] lg:h-[280px] flex items-center justify-center relative group
            ${selectedImage === "input" ? "animate-glow border-[#00d0ff]" : ""}`}
            onClick={() => {
              inputImage.current.click();
              setSelectedImage("input");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {!frontendImage ? (
              <div className="flex flex-col items-center justify-center p-4">
                <RiImageAddFill className="text-[#00d0ff] text-4xl mb-2" />
                <p className="text-white text-xs text-center">Upload your own</p>
              </div>
            ) : (
              <>
                <img className="h-full w-full object-cover" src={frontendImage} alt="Custom avatar" />
                {selectedImage === "input" && (
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
              </>
            )}
          </motion.div>

          <input type="file" ref={inputImage} accept="image/*" hidden onChange={handleImage} />
        </motion.div>
      </motion.div>

      {selectedImage && (
        <motion.button
          className="btn-primary mt-10 z-10"
          onClick={() => navigate("/coustomize2")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
      )}
    </motion.div>
  );
}

export default Coustomize;
