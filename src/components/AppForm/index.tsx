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
  OutlinedInput,
  Chip,
  Box,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { AppFormProps, AppFormData } from './AppForm.types';

const AppForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  repositories,
}: AppFormProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<AppFormData>({
    defaultValues: {
      name: '',
      repositoryIds: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        repositoryIds: initialData.repositoryIds,
      });
    } else {
      reset({
        name: '',
        repositoryIds: [],
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: AppFormData) => {
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
        {initialData ? 'Edit App' : 'Add New App'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'App name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="App Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message || 'Name of the application'}
                autoFocus
              />
            )}
          />
          <Controller
            name="repositoryIds"
            control={control}
            rules={{ 
              required: 'At least one repository is required',
              validate: (value) => value.length > 0 || 'At least one repository is required'
            }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.repositoryIds}>
                <InputLabel id="repositories-label">Repositories</InputLabel>
                <Select
                  {...field}
                  labelId="repositories-label"
                  multiple
                  input={<OutlinedInput label="Repositories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const repo = repositories.find(r => r.id === value);
                        return repo ? (
                          <Chip key={value} label={`${repo.owner}/${repo.name}`} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {repositories.length === 0 ? (
                    <MenuItem disabled>No repositories available</MenuItem>
                  ) : (
                    repositories.map((repo) => (
                      <MenuItem key={repo.id} value={repo.id}>
                        {repo.owner}/{repo.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText>
                  {errors.repositoryIds?.message || 'Select repositories that belong to this app'}
                </FormHelperText>
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

export default AppForm;
