import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
    const isAuthToken=window.localStorage.getItem("token")
    console.log("auth",isAuthToken);
    
  return isAuthToken?<Outlet/>:<Navigate to="/error"/>
}

export default ProtectedRoutes