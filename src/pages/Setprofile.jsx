import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/SetProfile.css'; 

import photo1 from '../assets/profiles/1.png';
import photo2 from '../assets/profiles/2.png';
import photo3 from '../assets/profiles/3.png';
import photo4 from '../assets/profiles/4.png';
import photo5 from '../assets/profiles/5.png';
import photo6 from '../assets/profiles/6.png';
import photo7 from '../assets/profiles/7.png';

const photos = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
];

export default function SetProfile() {
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSaveProfile = async () => {
    setIsLoading(true); // Start loader
    try {
      const id = localStorage.getItem('id'); // Ensure this retrieves the correct user ID
      const token = localStorage.getItem('token'); // Ensure this retrieves a valid token

      if (!id || !token) {
        setMessage('User ID or token missing.');
        setIsLoading(false); // Stop loader
        return;
      }

      const response = await fetch(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/set-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'id': id,
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profilePicture: selectedPhoto }),
        credentials: 'include' // Include cookies for session management, if needed
      });

      const data = await response.json();
      if (data.message === 'Profile picture updated successfully') {
        setMessage('Profile picture updated successfully!');
        setTimeout(() => {
          navigate('/profile'); // Redirect to profile after saving
        }, 1000); // Optional delay for user feedback
      } else {
        setMessage(data.message || 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while saving the profile picture.');
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Set Profile Picture</h1>
      <div className="profile-circle">
        <img src={selectedPhoto} alt="Selected Profile" />
      </div>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Profile Option ${index + 1}`}
            className={photo === selectedPhoto ? 'selected' : ''}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>
      <button className="save-button" onClick={handleSaveProfile} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Profile'}
      </button>
      {message && <p className="message">{message}</p>}
      {isLoading && <div className="loader"></div>} {/* Show loader while loading */}
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
}
