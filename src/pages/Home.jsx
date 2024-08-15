import React from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../assets/pokemon_poster/1.png';
import image2 from '../assets/pokemon_poster/2.png';
import image3 from '../assets/pokemon_poster/3.png';
import image4 from '../assets/pokemon_poster/4.png';
import '../css/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="main-content">
        <h1 className="main-title">Play</h1>
        <p className="main-subtitle">Play against the computer</p>
        <div className="game-modes">
          <div className="mode">
            <h2 className="mode-title">Single Player</h2>
            <p className="mode-subtitle">Battle against the computer</p>
            <button className="mode-btn" onClick={() => handleNavigation('/single-player')}>Start Game</button>
            <img src={image1} alt="Single Player" className="mode-image" />
          </div>
          <div className="mode">
            <h2 className="mode-title">Training Center</h2>
            <p className="mode-subtitle">Practice playing the game</p>
            <button className="mode-btn" onClick={() => handleNavigation('/training')}>Start Training</button>
            <img src={image3} alt="Training Center" className="mode-image" />
          </div>
          <div className="mode">
            <h2 className="mode-title">Leaderboard</h2>
            <p className="mode-subtitle">See how you rank</p>
            <button className="mode-btn" onClick={() => handleNavigation('/leaderboard')}>View Leaderboard</button>
            <img src={image4} alt="Leaderboard" className="mode-image" />
          </div>
        </div>
      </div>
      {/* Fixed links */}
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default Home;
