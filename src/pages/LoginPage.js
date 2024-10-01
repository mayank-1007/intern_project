import axios from 'axios'; 
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/userSlice';
// import './Login.css'; // Add your CSS styles here
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();  

  useEffect(() => {
    logout();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://intern-project-backend-fgxq.onrender.com/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      Cookies.set('user', (res.data.user), { expires: 7 });

      const userData = typeof res === 'string' ? JSON.parse(res) : res;

      if (userData && userData.data.user._id) {
        navigate('/hello');
      } else {
        console.error("Unexpected response structure:", res);
      }
    } catch (err) {
      if(err.response.data.msg === "Invalid credentials"){
        alert(err.response.data.msg);
        navigate('/signup');
      } else {
        alert(err.response.data.msg);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-custom w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        Don't have an account? <a href="/signup">Signup here</a>
      </p>
      <button onClick={() => navigate('/')} className="btn btn-link">Main Page</button>
    </div>
  );
};

export default LoginPage;
