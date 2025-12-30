import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { LinkFormProps, LinkFormData } from './LinkForm.types';

const LinkForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: LinkFormProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<LinkFormData>({
    defaultValues: {
      displayName: '',
      description: '',
      icon: '',
      href: '',
      target: '_blank',
      environment: 'Production',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        displayName: initialData.displayName,
        description: initialData.description,
        icon: initialData.icon,
        href: initialData.href,
        target: initialData.target,
        environment: initialData.environment,
      });
    } else {
      reset({
        displayName: '',
        description: '',
        icon: '',
        href: '',
        target: '_blank',
        environment: 'Production',
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: LinkFormData) => {
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
        {initialData ? 'Edit Link' : 'Add New Link'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name="displayName"
            control={control}
            rules={{ required: 'Display name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Display Name"
                fullWidth
                margin="normal"
                error={!!errors.displayName}
                helperText={errors.displayName?.message || 'Name to display for the link'}
                autoFocus
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message || 'Brief description of the link'}
              />
            )}
          />
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Icon"
                fullWidth
                margin="normal"
                helperText="Material UI icon name (e.g., Link, Launch, GitHub)"
              />
            )}
          />
          <Controller
            name="href"
            control={control}
            rules={{ 
              required: 'URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Must be a valid URL starting with http:// or https://',
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL"
                fullWidth
                margin="normal"
                error={!!errors.href}
                helperText={errors.href?.message || 'Full URL of the link'}
              />
            )}
          />
          <Controller
            name="target"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="target-label">Target</InputLabel>
                <Select
                  {...field}
                  labelId="target-label"
                  label="Target"
                >
                  <MenuItem value="_blank">New Tab (_blank)</MenuItem>
                  <MenuItem value="_self">Same Tab (_self)</MenuItem>
                  <MenuItem value="_parent">Parent Frame (_parent)</MenuItem>
                  <MenuItem value="_top">Full Window (_top)</MenuItem>
                </Select>
                <FormHelperText>Where to open the link</FormHelperText>
              </FormControl>
            )}
          />
          <Controller
            name="environment"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="environment-label">Environment</InputLabel>
                <Select
                  {...field}
                  labelId="environment-label"
                  label="Environment"
                >
                  <MenuItem value="Production">Production</MenuItem>
                  <MenuItem value="Test">Test</MenuItem>
                  <MenuItem value="Development">Development</MenuItem>
                </Select>
                <FormHelperText>Which environment this link belongs to</FormHelperText>
              </FormControl>
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
};

export default LinkForm;
