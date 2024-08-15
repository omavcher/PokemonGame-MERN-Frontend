// src/components/Friends.jsx
import React, { useState, useEffect } from 'react';
import '../css/Friends.css';
import axios from 'axios';
import { useWebSocket } from '../webscoket/WebSocketContext.jsx';

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { socket, onlineUsers } = useWebSocket();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/user-info`, {
          headers: {
            id: localStorage.getItem('id'),
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setUserData(userResponse.data);

        const friendsIds = userResponse.data.friends || [];

        if (friendsIds.length > 0) {
          const friendsResponse = await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/friends-info`, {
            ids: friendsIds
          }, {
            headers: {
              id: localStorage.getItem('id'),
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          setFriendsList(friendsResponse.data);
        } else {
          setFriendsList([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);

    try {
      const response = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/search-player`, {
        params: { id: event.target.value },
        headers: {
          id: localStorage.getItem('id'),
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSearchResults([response.data]);
    } catch (error) {
      console.error('Search error:', error.response ? error.response.data : error.message);
      setSearchResults([]);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const response = await axios.put(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/add-friend`, {
        friendId
      }, {
        headers: {
          id: localStorage.getItem('id'),
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      socket.emit('addFriend', { friendId });
  
      // Refetch user data to update the friends list
      fetchUserData();
    } catch (error) {
      console.error('Error adding friend:', error.response ? error.response.data : error.message);
    }
  };
  
  // Place the fetchUserData function outside the useEffect to use it in addFriend
  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/user-info`, {
        headers: {
          id: localStorage.getItem('id'),
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      setUserData(userResponse.data);
  
      const friendsIds = userResponse.data.friends || [];
  
      if (friendsIds.length > 0) {
        const friendsResponse = await axios.post(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/friends-info`, {
          ids: friendsIds
        }, {
          headers: {
            id: localStorage.getItem('id'),
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        setFriendsList(friendsResponse.data);
      } else {
        setFriendsList([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  const getStatusStyle = (isOnline) => ({
    fontWeight: 'bold',
    color: isOnline ? 'green' : 'red',
  });

  const getStatus = (userId) => {
    const user = onlineUsers.find(user => user._id === userId);
    return user ? (user.isOnline ? 'Online' : 'Offline') : 'Offline';
  };

  return (
    <div className="friends-container">
      <header className="friends-header">
        <h1>Friends</h1>
        <input
          type="text"
          placeholder="Find friends"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </header>

      <section className="search-results">
        <h2 className="section-title">Search Results</h2>
        {searchResults.map((player, index) => (
          <div key={index} className="player-card">
            <img src={player.dp} alt={player.name} className="player-avatar" />
            <div className="player-info">
              <h3>{player.name}</h3>
              <p>ID: {player._id}</p>
              <p style={getStatusStyle(getStatus(player._id) === 'Online')}>{getStatus(player._id)}</p>
              {/* Conditionally render the "Add Friend" button */}
              {player._id !== userData?._id && !friendsList.some(friend => friend._id === player._id) && (
                <button onClick={() => addFriend(player._id)} className="add-friend-button">
                  Add Friend
                </button>
              )}
              {/* Conditionally render a "Friend" button if already friends */}
              {friendsList.some(friend => friend._id === player._id) && (
                <button className="friend-button" disabled>
                  Friend
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="friends-list">
  <h2 className="section-title">Friends List</h2>
  {friendsList.map((friend) => (
    <a key={friend._id} href={`/profile/${friend._id}`} className="friend-card-link">
      <div className="friend-card">
        <img src={friend.dp} alt={friend.name} className="friend-avatar" />
        <div className="friend-info">
          <h3>{friend.name}</h3>
          <p>ID: {friend._id}</p>
          <p style={getStatusStyle(getStatus(friend._id) === 'Online')}>{getStatus(friend._id)}</p>
        </div>
      </div>
    </a>
  ))}
</section>
<div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default Friends;
