import React, { useState } from 'react';
import '../css/Login.css';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch } from 'react-redux'; // Import useDispatch
import { authActions } from '../store/auth.js'; // Import authActions

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage('Please fill out all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/log-in`, {
        email,
        password
      });

      dispatch(authActions.login()); // Dispatch login action
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);

      navigate('/'); // Redirect to home page

    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome back to PokeCards!</h1>
        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="login-options">
            <div>
              <input type="checkbox" id="keep-signed-in" />
              <label htmlFor="keep-signed-in">Keep me signed in.</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="sign-up-link">Don't have an account? <a href="/sign-up">Sign up</a></p>
      </div>

      {/* Embedded links */}
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
}
