import React from 'react'
import { Route,  Routes, Navigate } from 'react-router-dom'
import SingUp from './pages/SingUp'
import Login from './pages/Login'
import Coustomize from './pages/Coustomize'
import Home from './pages/Home'
import { useContext } from 'react'
import Coustomize2 from './pages/Coustomize2'
import { UserDataContext } from './context/UserContext'

function App() {

  const { userData,setUserData } = useContext(UserDataContext);
  return (
    <>
    <Routes>

    <Route path="/" element={userData?.user?.assistantImage && userData?.user?.assistantName? <Home />:<Navigate to={"/coustomize"} />} />
    <Route path="/singup" element={!userData?<SingUp />:<Navigate to={"/"} />} />
    <Route path="/login" element={!userData?<Login />:<Navigate to={"/"} />} />
    <Route path="/coustomize" element={userData?<Coustomize />:<Navigate to={"/singup"} />} />
    <Route path="/coustomize2" element={userData?<Coustomize2 />:<Navigate to={"/singup"} />} />

    </Routes>

    </>
  )
}

export default App