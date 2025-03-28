import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  NoteAdd as NoteIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };
  
  const onLogout = async () => {
    handleMenuClose();
    const success = await handleLogout();
    if (success) {
      console.log('Navigating to home after logout');
      // Used window.location for a hard redirect
      window.location.href = '/';
    }
  };
  
  const handleNavigation = (path) => {
    handleMenuClose();
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };
  
  // Profile menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      keepMounted
    >
      {user && (
        <MenuItem disabled>
          <Typography variant="body2">
            Signed in as {user.name}
          </Typography>
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={() => handleNavigation('/dashboard')}>
        <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
        Dashboard
      </MenuItem>
      <MenuItem onClick={() => handleNavigation('/editor')}>
        <NoteIcon fontSize="small" sx={{ mr: 1 }} />
        New Letter
      </MenuItem>
      {user && user.role === 'admin' && (
        <MenuItem onClick={() => handleNavigation('/admin')}>
          <AdminIcon fontSize="small" sx={{ mr: 1 }} />
          Admin
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={onLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );
  
  // Mobile menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMenuClose}
      keepMounted
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={() => handleNavigation('/dashboard')}>
            <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/editor')}>
            <NoteIcon fontSize="small" sx={{ mr: 1 }} />
            New Letter
          </MenuItem>
          {user && user.role === 'admin' && (
            <MenuItem onClick={() => handleNavigation('/admin')}>
              <AdminIcon fontSize="small" sx={{ mr: 1 }} />
              Admin
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={onLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={() => handleNavigation('/login')}>
          <AccountIcon fontSize="small" sx={{ mr: 1 }} />
          Login
        </MenuItem>
      )}
    </Menu>
  );
  
  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Name - Left Side */}
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            '&:hover': {
              color: 'white',
              opacity: 0.9
            }
          }}
        >
          Letter Drive
        </Typography>
        
        {/* Desktop Navigation - Right Side */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/dashboard')}
                sx={{ mr: 1 }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/editor')}
                sx={{ mr: 1 }}
              >
                New Letter
              </Button>
              {user?.role === 'admin' && (
                <Button 
                  color="inherit" 
                  onClick={() => handleNavigation('/admin')}
                  sx={{ mr: 1 }}
                >
                  Admin
                </Button>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                >
                  {user?.avatar ? (
                    <Avatar 
                      src={user.avatar} 
                      alt={user.name}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountIcon />
                  )}
                </IconButton>
              </Box>
            </>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => handleNavigation('/login')}
            >
              Login
            </Button>
          )}
        </Box>
        
        {/* Mobile Navigation - Right Side */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMenu}
      {renderMobileMenu}
    </AppBar>
  );
};

export default Navbar;