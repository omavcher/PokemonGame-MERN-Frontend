import React, { useState } from 'react';
import '../css/ForgotPassword.css'; // Import CSS for styling
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      setErrorMessage('Please enter your email.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/forgot-password`, { email });
      setMessage('Password reset instructions have been sent to your email.');
      setErrorMessage('');
      setTimeout(() => navigate('/log-in'), 3000); // Redirect after a short delay
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1 className="forgot-password-title">Forgot Password</h1>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <button type="submit" className="forgot-password-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
}
