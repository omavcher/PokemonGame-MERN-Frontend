import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { authActions } from '../store/auth';
import '../css/Profile.css';
import Loader from '../components/Loader/Loader';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/user-info`, {
          headers: {
            id: localStorage.getItem('id'),
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    window.location.href = '/log-in';
  };

  if (!userData) {
    return <Loader />;
  }

  const calculateLevelProgress = (level, wins) => {
    const winsNeededForNextLevel = (level + 1) ** 2 - level ** 2;
    const progress = Math.min(100, (wins % winsNeededForNextLevel) / winsNeededForNextLevel * 100);
    return progress;
  };

  const recentMatchesData = {
    labels: userData.wins.concat(userData.losses).map(match => new Date(match.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Wins',
        data: userData.wins.map(win => parseInt(win.points)),
        backgroundColor: '#4caf50',
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
      {
        label: 'Losses',
        data: userData.losses.map(loss => parseInt(loss.points)),
        backgroundColor: '#f44336',
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Points: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
  };

  const levelProgress = calculateLevelProgress(userData.level, userData.wins.length);


  

  return (
    <div className="profile-container">
      <header className="profile-header">
        <Link to="/set-profile" className="profile-pic-link">
          <img src={userData.dp || 'default-avatar.png'} alt="Profile" className="profile-pic" />
        </Link>
        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p className="player-id">ID: {userData._id}</p>
        </div>
        <div className="level-info">
          <span>Level {userData.level}</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${levelProgress}%` }}></div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <section className="cards-section">
        <div className="card wins-card">
          <h3>Total Wins</h3>
          <p>{userData.wins.length}</p>
        </div>
        <div className="card losses-card">
          <h3>Total Losses</h3>
          <p>{userData.losses.length}</p>
        </div>
      </section>

      <section className="recent-matches">
        <h2>Recent Matches</h2>
        <div className="chart-container">
          <Bar data={recentMatchesData} options={chartOptions} />
        </div>
      </section>
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default Profile;
