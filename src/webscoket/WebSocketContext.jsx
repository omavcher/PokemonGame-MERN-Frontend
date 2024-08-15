import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

const ENDPOINT = `${window.location.origin}`;

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    const socketInstance = io(ENDPOINT, {
      query: { userId },
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected server');
    });

    // Handle online status updates
    socketInstance.on('updateOnlineStatus', (data) => {

      setOnlineUsers((prevOnlineUsers) => {
        const existingUserIndex = prevOnlineUsers.findIndex(user => user._id === data.userId);

        if (existingUserIndex > -1) {
          const updatedUsers = [...prevOnlineUsers];
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            isOnline: data.status,
          };
          return updatedUsers;
        } else {
          return [...prevOnlineUsers, {
            _id: data.userId,
            isOnline: data.status,
          }];
        }
      });
    });

    // Handle game events
    socketInstance.on('gameStateUpdate', (newGameState) => {
      setGameState(newGameState);
    });

    return () => {
      socketInstance.off('connect');
      socketInstance.off('updateOnlineStatus');
      socketInstance.off('gameStateUpdate');
      socketInstance.disconnect();
    };
  }, []);

  const joinGame = (roomId) => {
    socket.emit('joinGame', { roomId });
  };

  const playCard = (card) => {
    socket.emit('playCard', { card });
  };

  return (
    <WebSocketContext.Provider value={{ socket, onlineUsers, gameState, joinGame, playCard }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
