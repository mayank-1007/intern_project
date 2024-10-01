import {React} from "react";
import { useNavigate } from 'react-router-dom';

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
        <div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignup}>Sigup</button>
            <button onClick={handleAdmin}>Admin</button>
        </div>
    );
};

export default LandingPage;