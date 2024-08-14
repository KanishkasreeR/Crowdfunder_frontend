import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Login.css';
import LoginHeader from './LoginHeader';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }
        try {
            const response = await axios.post('https://fundraising-platform.onrender.com/api/login', { email, password });
            toast.success("Login successful!");
            localStorage.setItem('token', response.data.token);
            navigate("/explore")
            setEmail('');
            setPassword('');
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.msg);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    return (
        <>
        <ToastContainer/>
        <LoginHeader/>
        <div className="login-wrapper">
            <div className="login-container">
                <div className="left-panel1">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-container">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-container1">
                            <FaLock className="input-icon1" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <button type="submit" className="submit-button">Login</button>
                        <p className="message1">{message}</p>
                        <p className="register-link">Don't have an account? <Link to="/register">Register here</Link></p>
                    </form>
                </div>
                <div className="right-panel1">
                    <img src="https://static.vecteezy.com/system/resources/previews/011/709/209/original/illustration-investment-or-investment-concept-showing-business-startup-receiving-funds-from-investors-suitable-for-landing-page-ui-web-app-intro-card-editorial-flyer-and-banner-vector.jpg" alt="Welcome" className="welcome-image1" />
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;


