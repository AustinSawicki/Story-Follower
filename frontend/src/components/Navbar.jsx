"use client"
import { Link, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function Navbar() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN))
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN))
    const location = useLocation();

    useEffect(() => {
      setAccessToken(localStorage.getItem(ACCESS_TOKEN))
      setRefreshToken(localStorage.getItem(REFRESH_TOKEN))
    , [location]})

    return (
        <nav className="flex justify-between items-center p-4 shadow-md">
          {accessToken && refreshToken &&
           <Link to="/" className="text-m font-bold hover:underline"> Home </Link>
          }
          <div className="text-2xl font-bold">Story Follower</div>
          <div className="flex gap-4">
          {accessToken && refreshToken && 
          (<Link to="/logout" className="text-gray-900 font-bold hover:underline">Logout</Link>)
          } 
          </div>
        </nav>
    )
}

export default Navbar