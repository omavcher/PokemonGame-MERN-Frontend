// src/components/Fprofile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/Fprofile.css'; 
import Loader from '../components/Loader/Loader';

const Fprofile = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserFprofile = async () => {
      try {
        const response = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/user-info/${userId}`, {
          headers: {
            id: localStorage.getItem('id'),
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user Fprofile:', error);
      }
    };

    fetchUserFprofile();
  }, [userId]);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="Fprofile-container">
      <div className="Fprofile-header">
        <img src={user.dp} alt={user.name} className="Fprofile-avatar" />
        <h1>{user.name}</h1>
      </div>
      <div className="Fprofile-info">
        <p>ID: {user._id}</p>
        <p>Status: {user.isOnline ? 'Online' : 'Offline'}</p>
        <p>Level: {user.level}</p>
        <p>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</p>
        
        <h3>Wins</h3>
        {user.wins.length > 0 ? (
          user.wins.map((win, index) => (
            <div key={index}>
              <p>Points: {win.points}</p>
              <p>Opponent: {win.opponent}</p>
              <p>Date: {new Date(win.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No wins recorded</p>
        )}

        <h3>Losses</h3>
        {user.losses.length > 0 ? (
          user.losses.map((loss, index) => (
            <div key={index}>
              <p>Points: {loss.points}</p>
              <p>Opponent: {loss.opponent}</p>
              <p>Date: {new Date(loss.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No losses recorded</p>
        )}
      </div>
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default Fprofile;
