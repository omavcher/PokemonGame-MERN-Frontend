import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Leaderboard.css'; 

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch the leaderboard data from the server
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/leaderboard`);
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Top Players</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player._id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default Leaderboard;
