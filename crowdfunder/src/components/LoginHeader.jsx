import React from 'react';
import '../css/LoginHeader.css';  
import {Link} from 'react-router-dom'

const LoginHeader = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                <span className="logo-crowd">Crowd</span>
                <span className="logo-funder">funder</span>
                </Link>
            </div>
            <div className="actions">
                <Link to = "/login" className="start-btn">Sign in</Link >
                <Link to = "/register" className="sign-in-btn">Sign up</Link>
            </div>
        </header>
    );
};

export default LoginHeader;

