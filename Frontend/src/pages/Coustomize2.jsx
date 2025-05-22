import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { FiUser, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { UserDataContext } from '../context/UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Coustomize2() {
  const navigate = useNavigate();
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const [assistantName, setAssistantName] = useState(userData?.user?.assistantName || "");
  const [nameError, setNameError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validate name input
  useEffect(() => {
    if (assistantName.trim() === "") {
      setNameError("");
    } else if (assistantName.length < 2) {
      setNameError("Name must be at least 2 characters");
    } else {
      setNameError("");
    }
  }, [assistantName]);

  const handleUpdateAssistant = async () => {
    if (assistantName.trim() === "" || assistantName.length < 2) {
      setNameError("Please enter a valid name (at least 2 characters)");
      return;
    }

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append('assistantName', assistantName);

      if (backendImage) {
        formData.append('assistantImage', backendImage);
      } else {
        formData.append('imageUrl', selectedImage);
      }

      const result = await axios.post(`${serverUrl}/api/user/updata`, formData, { withCredentials: true });

      // Wrap the user data in the same structure as the getCurrentUser endpoint
      const wrappedData = { user: result.data };
      setUserData(wrappedData);
      setSuccess(true);

      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1500);
    } catch (error) {
    
      setLoading(false);
      setNameError("An error occurred. Please try again.");
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
        onClick={() => navigate("/coustomize")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoArrowBackOutline className="text-[#00d0ff]" />
        <span>Back</span>
      </motion.button>

      <motion.div
        className="z-10 w-full max-w-xl px-6 py-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className="bg-[#ffffff08] backdrop-blur-md rounded-3xl p-8 border border-[#ffffff15]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00d0ff] to-[#6c63ff] flex items-center justify-center">
              <FiUser className="text-white text-4xl" />
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white text-center mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Name your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d0ff] to-[#6c63ff]">Assistant</span>
          </motion.h1>

          <motion.p
            className="text-[#ffffff80] text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Give your voice assistant a name you'll use to activate it
          </motion.p>

          <motion.div
            className="relative mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[#00d0ff]">@</span>
            </div>
            <input
              className="input-field pl-10"
              type="text"
              placeholder="e.g. Jarvis, Alexa, Friday..."
              required
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
            />
            {nameError && (
              <motion.p
                className="text-[#ff5e84] text-sm mt-2 pl-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {nameError}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              className={`btn-primary w-full flex items-center justify-center ${!assistantName.trim() || assistantName.length < 2 || loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={!assistantName.trim() || assistantName.length < 2 || loading}
              onClick={handleUpdateAssistant}
              whileHover={!loading && assistantName.trim() && assistantName.length >= 2 ? { scale: 1.03 } : {}}
              whileTap={!loading && assistantName.trim() && assistantName.length >= 2 ? { scale: 0.97 } : {}}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : success ? (
                <FiCheck className="mr-2" />
              ) : null}
              {success ? "Success!" : loading ? "Creating..." : "Create Your Assistant"}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Coustomize2;