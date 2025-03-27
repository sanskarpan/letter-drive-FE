// client/src/pages/Admin.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, letterId: null });
  const [searchTerm, setSearchTerm] = useState('');

  // Verify admin role
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setError('You do not have permission to access this page.');
      setLoading(false);
    }
  }, [user]);

  // Fetch all users and letters
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;

      try {
        const token = localStorage.getItem('token');
        
        // Fetch all users
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Fetch all letters
        const lettersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/letters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUsers(usersResponse.data);
        setLetters(lettersResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle letter deletion
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/letters/${deleteDialog.letterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update letters after successful deletion
      setLetters(letters.filter(letter => letter._id !== deleteDialog.letterId));
      setDeleteDialog({ open: false, letterId: null });
    } catch (err) {
      console.error('Error deleting letter:', err);
      setError('Failed to delete letter. Please try again.');
    }
  };

  // Filter letters based on search term
  const filteredLetters = letters.filter(
    letter =>
      letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(letter.user).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  if (loading) {
    return <Typography>Loading admin data...</Typography>;
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Statistics
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{users.length}</Typography>
            <Typography color="text.secondary">Total Users</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{letters.length}</Typography>
            <Typography color="text.secondary">Total Letters</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">
              {letters.filter(letter => letter.googleDriveId).length}
            </Typography>
            <Typography color="text.secondary">Drive Synced</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">All Letters</Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search letters or users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Drive Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLetters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No letters found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLetters.map((letter) => (
                  <TableRow key={letter._id}>
                    <TableCell>{letter.title}</TableCell>
                    <TableCell>{getUserName(letter.user)}</TableCell>
                    <TableCell>
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(letter.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {letter.googleDriveId ? (
                        <Chip
                          label="In Drive"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Local Only"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        component={Link}
                        to={`/admin/letter/${letter._id}`}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteDialog({ open: true, letterId: letter._id })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, letterId: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this letter? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, letterId: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;