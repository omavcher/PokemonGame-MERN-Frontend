import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useParams(); // Extract token from URL path

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/reset-password/${token}`, { password });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1 className="reset-password-title">Reset Your Password</h1>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {errorMessage && <p className="error-message" aria-live="assertive">{errorMessage}</p>}
          {successMessage && <p className="success-message" aria-live="assertive">{successMessage}</p>}
          <button type="submit" className="reset-password-button" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default ResetPassword;
