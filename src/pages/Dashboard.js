// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, letterId: null });
  const navigate = useNavigate();

  // Fetch user's letters
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/letters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLetters(response.data);
      } catch (err) {
        setError('Failed to fetch letters. Please try again.');
        console.error('Error fetching letters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  // Handle letter deletion
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/letters/${deleteDialog.letterId}`,
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

  if (loading) {
    return <Typography>Loading your letters...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Your Letters
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/editor"
          startIcon={<AddIcon />}
        >
          New Letter
        </Button>
      </Box>

      {/* Temporary Auth Debug Panel */}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {letters.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No letters yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            Create your first letter to get started
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/editor"
            startIcon={<AddIcon />}
          >
            Create Letter
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {letters.map((letter) => (
            <Grid item xs={12} sm={6} md={4} key={letter._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {letter.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {new Date(letter.updatedAt).toLocaleDateString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mt: 2 }}>
                    {letter.googleDriveId && (
                      <Chip
                        label="Saved to Drive"
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/editor/${letter._id}`}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => setDeleteDialog({ open: true, letterId: letter._id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

export default Dashboard;