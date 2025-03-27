// client/src/pages/Editor.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveToGoogleDrive, setSaveToGoogleDrive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [initialLoad, setInitialLoad] = useState(true);

  // Get letter data if editing an existing letter
  useEffect(() => {
    const fetchLetter = async () => {
      if (!id) {
        setInitialLoad(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/letters/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { title, content, googleDriveId } = response.data;
        setTitle(title);
        setContent(content);
        setSaveToGoogleDrive(!!googleDriveId);
      } catch (err) {
        console.error('Error fetching letter:', err);
        setNotification({
          open: true,
          message: 'Failed to load the letter. Please try again.',
          type: 'error',
        });
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchLetter();
  }, [id]);

  // Save letter
  const handleSave = async () => {
    if (!title.trim()) {
      setNotification({
        open: true,
        message: 'Please provide a title for your letter.',
        type: 'error',
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const payload = {
        title,
        content,
        saveToGoogleDrive,
      };

      let response;

      if (id) {
        // Update existing letter
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/letters/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new letter
        response = await axios.post(`${process.env.REACT_APP_API_URL}/api/letters`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Check for warning in the response (Google Drive error)
      if (response.data.warning) {
        setNotification({
          open: true,
          message: response.data.warning,
          type: 'warning',
        });
      } else {
        // Show success message
        setNotification({
          open: true,
          message: saveToGoogleDrive
            ? 'Letter saved successfully to Google Drive!'
            : 'Letter saved successfully!',
          type: 'success',
        });
      }

      // If it's a new letter, redirect to edit mode with the new ID
      if (!id && response.data._id) {
        navigate(`/editor/${response.data._id}`);
      } else if (!id && response.data.letter && response.data.letter._id) {
        navigate(`/editor/${response.data.letter._id}`);
      }
    } catch (err) {
      console.error('Error saving letter:', err);
      setNotification({
        open: true,
        message: 'Failed to save the letter. Please try again.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      [{ script: 'sub' }, { script: 'super' }],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  if (loading && initialLoad) {
    return <Typography>Loading letter...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={saveToGoogleDrive}
                onChange={(e) => setSaveToGoogleDrive(e.target.checked)}
                color="primary"
              />
            }
            label="Save to Google Drive"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={saveToGoogleDrive ? <CloudUploadIcon /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ ml: 2 }}
          >
            {saving ? 'Saving...' : 'Save Letter'}
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TextField
          label="Letter Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Letter Content
        </Typography>

        <Box sx={{ height: '500px', mb: 2 }}>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: '450px' }}
          />
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.type}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Editor;