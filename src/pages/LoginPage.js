import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/userSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();  // Use Redux dispatch hookc


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
            // Update Redux state
      const userData = typeof res === 'string' ? JSON.parse(res) : res;
      // console.log(JSON.parse(res));
      try {// Replace with your actual API call
        if (userData && userData.data.user._id) {
            // dispatch(setUser(userData.data.user));
            navigate('/hello');
        } else {
            console.error("Unexpected response structure:", res);
        }
      } catch (error) {
        console.error("Login error:", error);
        // Handle error (e.g., show a message to the user)
      }  // Save JWT token to localStorage
      // console.log("how are you!",res.data);
      // // alert('Login successful');
      // // const handleData = () => { 
      // //   setData(res.data);
      // // }
      // // handleData();  // Call function to update data in parent component
      
      
    } catch (err) {
      if(err.response.data.msg === "Invalid credentials"){
        alert(err.response.data.msg);
        navigate('/signup');
      }
      else{
        alert(err.response.data.msg);
      }
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/')}>Main Page</button>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
