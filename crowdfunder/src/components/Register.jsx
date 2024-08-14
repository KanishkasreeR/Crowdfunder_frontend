import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Register.css';
import { Link } from 'react-router-dom';
import LoginHeader from './LoginHeader';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        try {
            const response = await axios.post('https://fundraising-platform.onrender.com/api/register', 
                { name, email, password });
            toast.success(response.data.msg);
            setName('');
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
        <LoginHeader/>
        <div className="register-wrapper">
            <ToastContainer />
           
            <div className="register-container">
                <div className="left-panel">
                    <img src="https://givsum.s3.amazonaws.com/assets/landing-pages/LandingIllu-Home-edit-0ccd521ce333279991c8f87f8dc257e8181f4ac8f31e09268037319300e6c324.png" alt="Welcome" className="welcome-image" />
                </div>
                <div className="right-panel">
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="input-container">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                        <div className="input-container">
                            <FaLock className="input-icon" />
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
                        <button type="submit" className="submit-button">SIGN UP</button>
                    </form>
                    <p className="message">Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
                </div>
            </div>
        </div>
        </>
    );
};

export default Register;






