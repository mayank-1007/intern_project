import React from "react";
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Ensure to import the CSS file

const LandingPage = () => {
    const navigate = useNavigate();
    
    const handleLogin = () => {
        navigate('/login');
    }

    const handleSignup = () => {
        navigate('/signup');
    }

    const handleAdmin = () => {
        navigate('/admin');
    }

    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="logo">MyApp</div>
                <ul className="nav-links">
                    <li onClick={handleLogin}>Login</li>
                    <li onClick={handleSignup}>Signup</li>
                    <li onClick={handleAdmin}>Admin</li>
                </ul>
            </nav>
            <div className="hero-section">
                <div className="image-container">
                    <img src="/abcd.png" alt="Landing" />
                </div>
                <div className="text-container">
                    <h1>Welcome to MyApp</h1>
                    <p>Your journey begins here!</p>
                    <div className="button-container">
                        <button className="btn" onClick={handleLogin}>Login</button>
                        <button className="btn" onClick={handleSignup}>Signup</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
