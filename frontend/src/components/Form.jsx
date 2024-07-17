import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Link } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader"

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    useEffect(() => {
        setError(null)
      }, [usernameError, passwordError]);

    const handleSubmit = async (e) => {
        setLoading(true);
        setError(null)
        setUsernameError(null)
        setPasswordError(null)
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            // Error messages are formated differently for login vs register, these matches are for login error messages
            const usernameMatch =  error.response?.data?.error?.match(/'username': \[ErrorDetail\(string='(.*?)', code='.*?'\)\]/)
            const passwordMatch = error.response?.data?.error?.match(/'password': \[ErrorDetail\(string='(.*?)', code='.*?'\)\]/);
            if(error.response?.data?.username || usernameMatch){
                setUsernameError(error.response?.data?.username || usernameMatch[1])
            }
            if(error.response?.data?.password || passwordMatch) {
                setPasswordError(error.response?.data?.password || passwordMatch[1])
            }
            if (!usernameError && !passwordError){
                setError(error.response?.data?.error || "An error occurred. Re-enter you username and password");
            }
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-10 mb-10 p-4 max-w-md mx-auto bg-theme-dark rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold mb-6 text-center">{name}</h1>
            <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-button"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            <div className="mb-4"/>
            <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-button"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mb-5"/>
            {loading && (
                <div className="flex items-center justify-center">
                    <SyncLoader color="#cd7f4f"/>
                    <div className="mb-5"/>
                </div>
                )}
            
            <button className="w-full p-3 mb-6 bg-button text-white rounded-md hover:bg-button-dark transition duration-200 ease-in-out" type="submit">
                {name}
            </button>
            
            {method === "login" ? (
                <p>
                    Don't have an account? <Link to="/register" className="text-button hover:underline">Register</Link>
                </p>
            ) : (
                <p>
                    Already have an account? <Link to="/login" className="text-button hover:underline">Login</Link>
                </p>
            )}
        </form>

    );
}

export default Form;