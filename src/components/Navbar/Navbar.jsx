import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Import axios
import { authActions } from '../../store/auth.js'; // Import authActions
import logo from '../../assets/logo/pokeball-icon.png';

// Array of objects for pages with names and links
const pages = [
  { name: 'Home', link: '/' },
  { name: 'Friends', link: '/friends' },
];

// Array of objects for settings with names and links
const settings = [
  { name: 'Profile', link: '/profile' },
  { name: 'Logout', link: '#' },
];

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState({ dp: '', name: '' });

  const dispatch = useDispatch(); // Initialize dispatch
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/user-info`, {
          headers: {
            id: localStorage.getItem('id'),
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data); // Set user data from the response
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    dispatch(authActions.logout()); // Dispatch logout action
    localStorage.removeItem('id'); // Remove user id from local storage
    localStorage.removeItem('token'); // Remove token from local storage
    window.location.href = '/log-in'; // Redirect to login page
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Single logo for all screen sizes */}
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#FB4B04',
              textDecoration: 'none',
            }}
          >
            POKEMON - Om Avcher
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: '#FB4B04' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component="a" href={page.link}>
                  <Typography textAlign="center" sx={{ color: '#FB4B04' }}>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#FB4B04', display: 'block' }}
                component="a"
                href={page.link}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {userData.dp ? (
                      <Avatar alt={userData.name} src={userData.dp} />
                    ) : (
                      <Avatar>{userData.name.charAt(0).toUpperCase()}</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={setting.name === 'Logout' ? handleLogout : handleCloseUserMenu} component="a" href={setting.link}>
                      <Typography textAlign="center" sx={{ color: '#FB4B04' }}>{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{ color: '#FB4B04', borderColor: '#FB4B04' }}
                href="/log-in"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
