import React, { useState, useContext, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { motion } from "framer-motion";
import axios from "axios";

function SingUp() {
  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(UserDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSingup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/singup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );

      setSuccess(true);
      setUserData(result.data);

      setTimeout(() => {
        setLoading(false);
        navigate("/coustomize");
      }, 1500);

    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="min-h-screen w-full flex justify-center items-center overflow-hidden bg-gradient-to-b from-[#080818] via-[#0f0f2d] to-[#171757] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#6c63ff] filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] rounded-full bg-[#00d0ff] filter blur-[150px] opacity-20"></div>
      </div>

      {/* Animated circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[150px] h-[150px] rounded-full border border-[#ffffff20] z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 180]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] rounded-full border border-[#ffffff20] z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
          rotate: [180, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Form container */}
      <motion.div
        className="z-10 w-full max-w-md px-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div
          className="bg-[#ffffff08] backdrop-blur-md rounded-3xl p-8 border border-[#ffffff15] shadow-xl shadow-[#00d0ff20]"
          variants={itemVariants}
        >
          <motion.div
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00d0ff] to-[#6c63ff] flex items-center justify-center">
              <FiUser className="text-white text-3xl" />
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-center mb-2"
            variants={itemVariants}
          >
            <span className="text-white">Create your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d0ff] to-[#6c63ff]">Account</span>
          </motion.h1>

          <motion.p
            className="text-[#ffffff80] text-center mb-8"
            variants={itemVariants}
          >
            Join the next generation of voice assistants
          </motion.p>

          <form onSubmit={handleSingup}>
            <motion.div className="mb-4 relative" variants={itemVariants}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiUser className="text-[#00d0ff]" />
              </div>
              <input
                className="input-field pl-10"
                type="text"
                placeholder="Your Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </motion.div>

            <motion.div className="mb-4 relative" variants={itemVariants}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="text-[#00d0ff]" />
              </div>
              <input
                className="input-field pl-10"
                type="email"
                placeholder="Your Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </motion.div>

            <motion.div className="mb-2 relative" variants={itemVariants}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-[#00d0ff]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input-field pl-10"
                placeholder="Your Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoMdEyeOff className="text-[#ffffff80] hover:text-[#00d0ff] transition-colors" />
                ) : (
                  <IoMdEye className="text-[#ffffff80] hover:text-[#00d0ff] transition-colors" />
                )}
              </div>
            </motion.div>

            {error && (
              <motion.p
                className="text-[#ff5e84] text-sm mb-4 pl-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              className="btn-primary w-full flex items-center justify-center mt-6"
              variants={itemVariants}
              disabled={loading || success}
              whileHover={!loading && !success ? { scale: 1.03 } : {}}
              whileTap={!loading && !success ? { scale: 0.97 } : {}}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : success ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : null}
              {success ? "Success!" : loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p className="text-[#ffffff80]">
              Already have an account?{" "}
              <motion.span
                className="text-[#00d0ff] font-medium cursor-pointer inline-block"
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SingUp;
