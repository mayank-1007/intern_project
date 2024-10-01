import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log(name + ' ' + email + ' ' + password);
      const res = await axios.post('http://localhost:5000/api/signup', {
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
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
