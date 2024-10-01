import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log(name + ' ' + email + ' ' + password);
      const res = await axios.post('https://intern-project-backend-fgxq.onrender.com/api/signup', {
        name,
        email,
        password,
      });
      if(res.data.token){
        alert('Signup successful');
        navigate('/login');
      }
      else if(res.data.msg === "User already exists"){
        if(res.data.user.password !== password) console.log(res.data.user.password,password);
        if(res.data.user.name === name){
          alert('User already exists');
          navigate('/login');
        }
        else{
          alert('User already exists with different credentials. Try with Another email!');
        }
      }
      console.log('Response:', res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        alert(`Signup failed: ${err.response.data.msg}`);
    } else {
        console.error('Signup failed:', err);
        alert('Signup failed due to an unexpected error.');
    }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signup</h2>
      <form onSubmit={handleSignup} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="btn btn-custom w-100">Signup</button>
      </form>
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default SignupPage;
