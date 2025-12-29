import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { RepositoryFormProps, RepositoryFormData } from './RepositoryForm.types';

export default function RepositoryForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: RepositoryFormProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<RepositoryFormData>({
    defaultValues: {
      name: '',
      owner: '',
      url: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        owner: initialData.owner,
        url: initialData.url,
      });
    } else {
      reset({
        name: '',
        owner: '',
        url: '',
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: RepositoryFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Repository' : 'Add New Repository'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name="owner"
            control={control}
            rules={{ required: 'Owner is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Owner"
                fullWidth
                margin="normal"
                error={!!errors.owner}
                helperText={errors.owner?.message || 'GitHub username or organization'}
                autoFocus
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Repository name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Repository Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message || 'Repository name (e.g., my-project)'}
              />
            )}
          />
          <Controller
            name="url"
            control={control}
            rules={{ 
              required: 'URL is required',
              pattern: {
                value: /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/,
                message: 'Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)',
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Repository URL"
                fullWidth
                margin="normal"
                error={!!errors.url}
                helperText={errors.url?.message || 'Full GitHub repository URL'}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
