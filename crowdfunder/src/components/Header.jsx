import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <span className="logo-crowd">Crowd</span>
                    <span className="logo-funder">funder</span>
                </Link>
            </div>
            <div className="actions">
                <Link to="/explore" className="button">Explore</Link>
                <Link to="/createcampaign" className="button">Start Crowdfunding</Link>
                <div className="profile-menu" onClick={toggleDropdown}>
                    <span className="profile-icon">
                        <i className="fas fa-user"></i> 
                    </span> 
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/mycampaign">My Campaigns</Link>
                            <Link to="/following">Following Campaigns</Link>
                            <button onClick={handleLogout} className="dropdown-menu-item">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
