import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Alert,
  Typography,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import WarningIcon from '@mui/icons-material/Warning';
import type { BackupRestoreDialogProps, BackupFormat } from './BackupRestoreDialog.types';
import {
  exportData,
  toJSON,
  toXML,
  toCSV,
  downloadBackup,
  importBackup,
  getLastBackupTimestamp,
  isBackupOlderThanWeek,
} from '../../utils/backup';

export default function BackupRestoreDialog({ open, onClose }: BackupRestoreDialogProps) {
  const [format, setFormat] = useState<BackupFormat>('json');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastBackupTimestamp = getLastBackupTimestamp();
  const showBackupWarning = isBackupOlderThanWeek();

  const handleFormatChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(event.target.value as BackupFormat);
  }, []);

  const handleBackup = useCallback(async () => {
    setLoading(true);
    try {
      const data = await exportData();
      let content: string;

      switch (format) {
        case 'json':
          content = toJSON(data);
          break;
        case 'xml':
          content = toXML(data);
          break;
        case 'csv':
          content = toCSV(data);
          break;
      }

      downloadBackup(content, format);
      setSnackbarMessage('Backup downloaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [format]);

  const handleRestoreClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await file.text();
      
      // Determine format from file extension
      const fileFormat = file.name.split('.').pop()?.toLowerCase() as BackupFormat;
      if (!['json', 'xml', 'csv'].includes(fileFormat)) {
        throw new Error('Invalid file format. Please use .json, .xml, or .csv file.');
      }

      await importBackup(content, fileFormat);
      setSnackbarMessage('Data restored successfully! Please refresh the page to see the changes.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setSnackbarMessage(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const formatLastBackupDate = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Backup & Restore</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {showBackupWarning && (
              <Alert severity="warning" icon={<WarningIcon />}>
                Your last backup was more than 1 week ago. Consider creating a new backup!
              </Alert>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Last backup: {formatLastBackupDate(lastBackupTimestamp)}
              </Typography>
            </Box>

            <FormControl component="fieldset">
              <FormLabel component="legend">Backup Format</FormLabel>
              <RadioGroup value={format} onChange={handleFormatChange} row>
                <FormControlLabel value="json" control={<Radio />} label="JSON" />
                <FormControlLabel value="xml" control={<Radio />} label="XML" />
                <FormControlLabel value="csv" control={<Radio />} label="CSV" />
              </RadioGroup>
            </FormControl>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Backup includes all features, tags, and repositories.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRestoreClick}
            startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
            variant="outlined"
            disabled={loading}
          >
            Restore
          </Button>
          <Button
            onClick={handleBackup}
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
            variant="contained"
            disabled={loading}
          >
            Backup
          </Button>
        </DialogActions>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.xml,.csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
