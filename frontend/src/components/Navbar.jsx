import { Link, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import { IoIosAlbums } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { RiSettings4Fill } from "react-icons/ri";

function Navbar() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN));
    const location = useLocation();

    useEffect(() => {
        setAccessToken(localStorage.getItem(ACCESS_TOKEN));
        setRefreshToken(localStorage.getItem(REFRESH_TOKEN));
    }, [location]);

    // Check if the current route matches the pattern /stories/${id}/tree
    const match = location.pathname.match(/\/stories\/(\d+)\/tree/);
    const storyId = match ? match[1] : null;

    return (
        <nav className="flex justify-between items-center p-4 shadow-md">
            <div className="flex items-center gap-4">
                {storyId && (
                    <Link to={`/stories/${storyId}`} className="text-m font-bold hover:underline">
                        <IoArrowBack className="mr-2 text-3xl text-button hover:text-button-dark" />
                    </Link>
                )}
                {accessToken && refreshToken && (
                    <Link to="/" className="text-m font-bold hover:underline">
                        <IoIosAlbums className="text-3xl text-button hover:text-button-dark" />
                    </Link>
                )}
            </div>
            <div className="flex-1 text-center text-2xl font-bold">Story Follower</div>
            <div className="flex gap-4">
                {accessToken && refreshToken && (
                    <>
                    <Link to="/user-settings" className="text-gray-900 font-bold hover:underline">
                        <RiSettings4Fill className="text-3xl text-button hover:text-button-dark" />
                    </Link>
                    <Link to="/logout" className="text-gray-900 font-bold hover:underline">
                        <IoLogOutOutline className="text-3xl text-button hover:text-button-dark" />
                    </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;