import React, { useState } from 'react';
import '../css/SignUp.css';
import axios from 'axios'; // Import axios if you are using it
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch } from 'react-redux'; // Import useDispatch
import { authActions } from '../store/auth.js'; // Import authActions

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !gender) {
      setErrorMessage('Please fill out all fields.');
      setIsLoading(false);
      return;
    }

    try {
      // First, sign up the user
      const signupResponse = await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/sign-up`, {
        name,
        email,
        password,
        gender
      });

      // Now, log in the user automatically
      const loginResponse = await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/log-in`, {
        email,
        password
      });

      // Dispatch login action
      dispatch(authActions.login());
      localStorage.setItem("id", loginResponse.data.id);
      localStorage.setItem("token", loginResponse.data.token);

      // Redirect to the set-profile page
      navigate('/set-profile');

    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Create an Account</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />

            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Gender</label>
            <select 
              required 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <p className="sign-up-link">Already have an account? <a href="/log-in">Login</a></p>
        </div>
      </div>
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
}
