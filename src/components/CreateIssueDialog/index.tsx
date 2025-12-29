import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import type { CreateIssueDialogProps } from './CreateIssueDialog.types';

export default function CreateIssueDialog({
  open,
  feature,
  repositories,
  onClose,
  onCreateIssue,
}: CreateIssueDialogProps) {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('');

  const handleCreate = () => {
    if (selectedRepositoryId) {
      onCreateIssue(selectedRepositoryId);
      setSelectedRepositoryId('');
    }
  };

  const handleClose = () => {
    setSelectedRepositoryId('');
    onClose();
  };

  if (!feature) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create GitHub Issue</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Feature:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {feature.title}
          </Typography>
        </Box>

        {repositories.length === 0 ? (
          <Alert severity="warning">
            No repositories available. Please add a repository first in the Repository Management section.
          </Alert>
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel id="repository-select-label">Select Repository</InputLabel>
            <Select
              labelId="repository-select-label"
              id="repository-select"
              value={selectedRepositoryId}
              label="Select Repository"
              onChange={(e) => setSelectedRepositoryId(e.target.value)}
            >
              {repositories.map((repo) => (
                <MenuItem key={repo.id} value={repo.id}>
                  {repo.owner}/{repo.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          This will open GitHub in a new tab with the issue form pre-filled with the feature details.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!selectedRepositoryId}
        >
          Create Issue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
