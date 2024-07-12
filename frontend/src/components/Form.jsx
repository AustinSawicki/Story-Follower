import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                console.log("access", res.data.access)
                console.log("access", res.data.refresh)
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center m-12 p-8 shadow-lg max-w-md w-1/4 bg-dark_beige">
                <h1 className="text-2xl font-bold mb-6">{name}</h1>
                <input
                    className="w-11/12 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oak"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    className="w-11/12 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oak"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {loading && <LoadingIndicator />}
                <button className="w-11/12 p-3 mb-6 bg-oak text-white rounded-md hover:bg-oak-dark transition duration-200 ease-in-out" type="submit">
                    {name}
                </button>
                
                {method === "login" ? (
                    <p>
                        Don't have an account? <Link to="/register" className="text-oak hover:underline">Register</Link>
                    </p>
                ) : (
                    <p>
                        Already have an account? <Link to="/login" className="text-oak hover:underline">Login</Link>
                    </p>
                )}
            </form>
        </div>
    );
}

export default Form