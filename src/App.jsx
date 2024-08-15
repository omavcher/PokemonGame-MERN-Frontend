import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../src/store/auth.js'; // Import authActions

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import SetProfile from './pages/Setprofile.jsx';
import CardSearch from './pages/CardDisplay.jsx';
import Friends from './pages/Friends.jsx';
import SinglePlayer from './pages/SinglePlayer.jsx';
import TrainingCenter from './pages/TrainingCenter.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import FProfile from './pages/FProfile.jsx';
import NotFound from './pages/NotFound.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
  
    if (id && token) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar /> {/* Always render Navbar */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/training" element={<TrainingCenter />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login/>} />
        <Route path="/set-profile" element={isLoggedIn ? <SetProfile /> :  <Login/>} />
        <Route path="/card-search" element={isLoggedIn ? <CardSearch /> :  <Login/>} />
        <Route path="/friends" element={isLoggedIn ? <Friends /> : <Login/>} />
        <Route path="/single-player" element={isLoggedIn ? <SinglePlayer /> : <Login/>} />
        <Route path="/profile/:userId" element={isLoggedIn ? <FProfile /> : <Login/>} />

        {/* Authentication Routes */}
        <Route path="/log-in" element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/sign-up" element={!isLoggedIn ? <SignUp /> : <Navigate to="/" replace />} />
        
        {/* Catch-all route for 404 - Page Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
