import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const UserDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = 'http://localhost:8000'
  const [userData,setUserData] = useState(null)
  const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const[selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setUserData(result.data)
      
    } catch (error) {
    
    }
  }
const getGeminiResponse = async (command)=>{
  try {
    const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
    return result.data
  } catch (error) {
    
    
  }
}

  useEffect(() => {
    handleCurrentUser()
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage,
    getGeminiResponse
    
  }
 
  return <div>
    <UserDataContext.Provider value={value}>
    {children}
    </UserDataContext.Provider>
    
    </div>;
}

export default UserContext;
